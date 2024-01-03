import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsQueryRepository {
  getCommentsByPostId(
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ) {
    const sortQuery: any = {};
    sortQuery[sortBy] = sortDirection === 'asc' ? 1 : -1;
    console.log(pageNumber, pageSize);

    // const filter = { postId: postId };
    return sortQuery;
  }

  getAllPosts(
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ) {
    console.log(pageNumber, pageSize);
    const sortQuery: any = {};
    sortQuery[sortBy] = sortDirection === 'asc' ? 1 : -1;
  }

  getPostByBlogId(
    blogId: string,
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ) {
    console.log(pageNumber, pageSize);
    const sortQuery: any = {};
    sortQuery[sortBy] = sortDirection === 'asc' ? 1 : -1;

    const filter = { blogId: blogId };
    return filter;
  }

  getPostById(id: string) {
    return id;
  }
}
