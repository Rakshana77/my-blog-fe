import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Form,
  Button,
  ListGroup,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';

const App = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('');

  const fetchPosts = async () => {
    const response = await axios.get('http://localhost:5000/posts');
    setPosts(response.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get('http://localhost:5000/categories');
    setCategories(response.data);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/posts', { title, content, category });
    setTitle('');
    setContent('');
    setCategory('');
    fetchPosts();
  };

  const handleDeletePost = async (id) => {
    await axios.delete(`http://localhost:5000/posts/${id}`);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // Filter posts by category
  const filteredPosts = filteredCategory
    ? posts.filter((post) => post.category === filteredCategory)
    : posts;

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Blog Posts</h1>

      {/* Create Post Form */}
      <Form onSubmit={handleCreatePost} className="mb-4">
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formContent">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category (e.g., Tech, Lifestyle)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Post
        </Button>
      </Form>

      {/* Categories Filter */}
      <DropdownButton
        id="dropdown-categories"
        title={filteredCategory || 'Filter by Category'}
        className="mb-4"
      >
        <Dropdown.Item onClick={() => setFilteredCategory('')}>
          All Categories
        </Dropdown.Item>
        {categories.map((cat) => (
          <Dropdown.Item key={cat} onClick={() => setFilteredCategory(cat)}>
            {cat}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      {/* List Posts */}
      <ListGroup>
        {filteredPosts.map((post) => (
          <ListGroup.Item
            key={post._id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>{post.title}</h5>
              <p>{post.content}</p>
              <small className="text-muted">Category: {post.category}</small>
            </div>
            <Button variant="danger" onClick={() => handleDeletePost(post._id)}>
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default App;
