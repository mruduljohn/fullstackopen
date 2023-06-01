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
    favoriteBlog
  };
  