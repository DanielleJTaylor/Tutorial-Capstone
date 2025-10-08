// src/__tests__/posts.test.js
import mongoose from 'mongoose';
import { describe, test, expect, beforeEach } from '@jest/globals';

import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js';
import { Post } from '../db/models/post.js';

/* ----------------------------------------------------------------------------
 * creating posts
 * --------------------------------------------------------------------------*/
describe('creating posts', () => {
  beforeEach(async () => {
    await Post.deleteMany({});
  });

  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
      author: 'Daniel Bugl',
      contents: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    };

    const created = await createPost(post);
    expect(created._id).toBeInstanceOf(mongoose.Types.ObjectId);

    const found = await Post.findById(created._id);
    expect(found).toEqual(
      expect.objectContaining({
        title: post.title,
        author: post.author,
        contents: post.contents,
      })
    );
    expect(found.createdAt).toBeInstanceOf(Date);
    expect(found.updatedAt).toBeInstanceOf(Date);
  });

  test('without title should fail', async () => {
    const post = { author: 'Daniel Bugl', contents: 'Post with no title', tags: ['empty'] };

    await expect(createPost(post)).rejects.toBeInstanceOf(mongoose.Error.ValidationError);
    // tolerate different exact wording/casing from Mongoose
    await expect(createPost(post)).rejects.toThrow(/required/i);
  });

  test('with minimal parameters should succeed', async () => {
    const created = await createPost({ title: 'Only a title' });
    expect(created._id).toBeInstanceOf(mongoose.Types.ObjectId);

    const found = await Post.findById(created._id);
    expect(found).toEqual(expect.objectContaining({ title: 'Only a title' }));
    expect(Array.isArray(found.tags ?? [])).toBe(true);
  });
});

/* ----------------------------------------------------------------------------
 * shared seed
 * --------------------------------------------------------------------------*/
const samplePosts = [
  { title: 'Learning Redux', author: 'Daniel Bugl', tags: ['redux'] },
  { title: 'Learn React Hooks', author: 'Daniel Bugl', tags: ['react'] },
  { title: 'Full-Stack React Projects', author: 'Daniel Bugl', tags: ['react', 'nodejs'] },
  { title: 'Guide to TypeScript', author: 'Jane Dev', tags: ['ts'] },
];

let docs = [];

/* ----------------------------------------------------------------------------
 * listing posts (your 5 checks)
 * --------------------------------------------------------------------------*/
describe('listing posts', () => {
  beforeEach(async () => {
    await Post.deleteMany({});
    docs = [];
    // sequential saves to help createdAt progress forward
    for (const p of samplePosts) {
      docs.push(await new Post(p).save());
    }
  });

  test('should return all posts', async () => {
    const rows = await listAllPosts();
    expect(rows).toHaveLength(samplePosts.length);
  });

  test('should return posts sorted by creation date descending by default', async () => {
    const rows = await listAllPosts(); // default is createdAt desc
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(rows[i].createdAt.getTime());
    }
  });

  test('should take into account provided sorting options', async () => {
    const desc = await listAllPosts(); // default createdAt desc
    const asc = await listAllPosts({ sortBy: 'createdAt', sortOrder: 'ascending' });

    // 1) Ascending order is actually non-decreasing by createdAt
    for (let i = 1; i < asc.length; i++) {
      expect(asc[i - 1].createdAt.getTime()).toBeLessThanOrEqual(asc[i].createdAt.getTime());
    }

    // 2) And it’s not the same order as default (so the option had an effect)
    const descIds = desc.map(x => String(x._id));
    const ascIds = asc.map(x => String(x._id));
    expect(ascIds.join(',')).not.toBe(descIds.join(','));
  });

  test('should be able to filter posts by author', async () => {
    const rows = await listPostsByAuthor('Daniel Bugl');
    expect(rows.length).toBeGreaterThan(0); // <- replace toHaveLength(expect.any(Number))
    expect(rows.every(r => r.author === 'Daniel Bugl')).toBe(true);
  });

  test('should be able to filter by tag', async () => {
    const rows = await listPostsByTag('react');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every(r => r.tags.includes('react'))).toBe(true);
  });
});

/* ----------------------------------------------------------------------------
 * get / update / delete
 * --------------------------------------------------------------------------*/
describe('get/update/delete a single post', () => {
  beforeEach(async () => {
    await Post.deleteMany({});
    docs = [];
    for (const p of samplePosts) docs.push(await new Post(p).save());
  });

  test('getPostById returns the exact post', async () => {
    const target = docs[1];
    const found = await getPostById(target._id);
    expect(found).toBeTruthy();
    expect(found.title).toBe(target.title);
  });

  test('updatePost updates fields and returns the updated doc', async () => {
    const target = docs[0];
    const updated = await updatePost(target._id, {
      title: 'Updated Title',
      author: target.author,
      contents: 'Edited contents',
      tags: ['edited'],
    });
    expect(updated).toBeTruthy();
    expect(updated.title).toBe('Updated Title');
    expect(updated.tags).toEqual(['edited']);
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(updated.createdAt.getTime());
  });

  test('updatePost enforces validation (empty title fails)', async () => {
    await expect(updatePost(docs[0]._id, { title: '' }))
      .rejects.toBeInstanceOf(mongoose.Error.ValidationError);
    await expect(updatePost(docs[0]._id, { title: '' }))
      .rejects.toThrow(/required/i);
  });

  test('deletePost removes a record', async () => {
    const target = docs[0];
    await deletePost(target._id); // ignore return, assert DB state
    const after = await Post.findById(target._id);
    expect(after).toBeNull();
  });
});
