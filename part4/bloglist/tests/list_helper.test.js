const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});
describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ];
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog);
      expect(result).toBe(5);
    });
  });
  describe('favorite blog', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ];
  
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
      },
      {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
      }
    ];
  
    test('when list has only one blog, returns that blog', () => {
      const result = listHelper.favoriteBlog(listWithOneBlog);
      expect(result).toEqual({
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
      });
    });
  
    test('when list has multiple blogs, returns the one with most likes', () => {
      const result = listHelper.favoriteBlog(listWithMultipleBlogs);
      expect(result).toEqual({
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      });
    });
});
describe('most blogs', () => {
    test('author with the most blogs', () => {
        const blogs = [
          {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
          },
          {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            __v: 0
          },
          {
            _id: '5a422b891b54a676234d17fa',
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
            likes: 10,
            __v: 0
          },
          {
            _id: '5a422ba71b54a676234d17fb',
            title: 'TDD harms architecture',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
            likes: 0,
            __v: 0
          }
        ];
      
        const result = listHelper.mostBlogs(blogs);
        expect(result).toEqual({
          author: 'Edsger W. Dijkstra',
          blogs: 2
        });
            
  });
});
describe('most likes', () => {
    test('author with the most likes', () => {
      const blogs = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
          likes: 5,
          __v: 0
        },
        {
          _id: '5a422b3a1b54a676234d17f9',
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          likes: 12,
          __v: 0
        },
        {
          _id: '5a422b891b54a676234d17fa',
          title: 'First class tests',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
          likes: 10,
          __v: 0
        },
        {
          _id: '5a422ba71b54a676234d17fb',
          title: 'TDD harms architecture',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
          likes: 15,
          __v: 0
        }
      ];
  
      const result = listHelper.mostLikes(blogs);
      expect(result).toEqual({
        author: 'Robert C. Martin',
        likes: 25
      });
    });
    test('multiple authors with the same highest likes', () => {
        const blogs = [
          {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 20,
            __v: 0
          },
          {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 15,
            __v: 0
          },
          {
            _id: '5a422b891b54a676234d17fa',
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
            likes: 25,
            __v: 0
          },
          {
            _id: '5a422ba71b54a676234d17fb',
            title: 'TDD harms architecture',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
            likes: 30,
            __v: 0
          }
        ];
    
        const result = listHelper.mostLikes(blogs);
        expect(result).toEqual({
          author: 'Robert C. Martin',
          likes: 55
        });
      });
    
      test('empty blog list', () => {
        const blogs = [];
    
        const result = listHelper.mostLikes(blogs);
        expect(result).toEqual(null);
      });            
});