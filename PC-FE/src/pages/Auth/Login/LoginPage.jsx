import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Divider, 
  Space
} from 'antd';
import SideDogAnimation from '../../../components/Animations/SideDogAnimation';
import { 
  UserOutlined, 
  LockOutlined, 
  LoginOutlined, 
  UserAddOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import styles from './LoginPage.module.css';

const { Title, Text, Paragraph } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      await login(values);
     
      console.log("POST /auth/login successful");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.toString());
      form.setFields([
        {
          name: 'password',
          errors: ['Invalid email or password. Please try again.'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.navBackButtonContainer}>
        <Link to="/">
          <Button 
            icon={<ArrowLeftOutlined />} 
            className={styles.backButton}
            size="large"
          >
            Back to Home
          </Button>
        </Link>
      </div>
      
      <Row gutter={[24, 0]} align="middle" justify="center" className={styles.contentRow}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.animationColumn}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.animationContainer}
          >
            <SideDogAnimation position="right" />
            <div className={styles.animationCaption}>
              <h3>Welcome Back</h3>
              <p>Sign in to continue your pet care journey</p>
            </div>
          </motion.div>
        </Col>
        
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.cardContainer}
          >
            <Card 
              bordered={true}
              className={styles.loginCard}
            >
            <div className={styles.formHeader}>
              <Title level={2}>Sign In</Title>
              <Paragraph type="secondary">Access your account to manage pet care services</Paragraph>
            </div>

            <Form
              form={form}
              name="login"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#1890ff' }} />} 
                  placeholder="Email" 
                  autoComplete="email"
                  size="large"
                  className={styles.inputField}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                  placeholder="Password"
                  autoComplete="current-password"
                  size="large"
                  className={styles.inputField}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: '12px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  icon={<LoginOutlined />}
                  className={styles.submitButton}
                  size="large"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Form.Item>
              
              <div style={{ textAlign: 'center' }}>
                <Paragraph type="secondary" className={styles.helpText}>
                  <Space className={isMobile ? styles.passwordReset : ''}>
                    Forgot password?
                    <Link to="/forgot-password" className={styles.passwordResetLink}>Reset it here</Link>
                  </Space>
                </Paragraph>
              </div>
            </Form>

            <Divider plain>Or</Divider>
            
            <Row gutter={16}>
              <Col span={24}>
                <Link to="/register">
                  <Button 
                    block 
                    icon={<UserAddOutlined />}
                    className={styles.createAccountButton}
                    size="large"
                  >
                    Create New Account
                  </Button>
                </Link>
              </Col>
            </Row>
            

          </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;