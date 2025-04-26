import { Link } from 'react-router-dom';
import styled from 'styled-components';

function NotFoundPage() {
  return (
    <Container>
      <Title>404</Title>
      <Subtitle>Page Not Found</Subtitle>
      <Message>We couldn't find the page you're looking for.</Message>
      <HomeButton to="/">Back to Home</HomeButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  text-align: center;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 5rem;
  color: #e74c3c;
  margin: 0;
`;

const Subtitle = styled.h2`
  font-size: 1.8rem;
  margin: 10px 0;
`;

const Message = styled.p`
  color: #666;
  margin-bottom: 25px;
`;

const HomeButton = styled(Link)`
  background: #3498db;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
  
  &:hover {
    background: #2980b9;
  }
`;

export default NotFoundPage;