const _ = require('lodash');

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
      return null;
    }
  
    const authorLikes = _.groupBy(blogs, 'author');
    const authorTotalLikes = _.mapValues(authorLikes, (blogs) =>
      _.sumBy(blogs, 'likes')
    );
  
    const topAuthor = _.maxBy(Object.keys(authorTotalLikes), (author) =>
      authorTotalLikes[author]
    );
  
    return {
      author: topAuthor,
      likes: authorTotalLikes[topAuthor]
    };
  };
  
const mostBlogs = (blogs) => {
  const blogCounts = _.countBy(blogs, 'author');

  const topAuthor = _.maxBy(Object.keys(blogCounts), (author) => blogCounts[author]);

  return {
    author: topAuthor,
    blogs: blogCounts[topAuthor]
  };
};

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
    const likes = blogs.reduce((sum, blog) => {
      return sum + blog.likes;
    }, 0);
  
    return likes;
  }

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return null;
    }
  
    const favorite = blogs.reduce((max, blog) => {
      return blog.likes > max.likes ? blog : max;
    }, blogs[0]);
  
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    };
  }
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  };
  