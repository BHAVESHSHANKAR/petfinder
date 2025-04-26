import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Divider, 
  Radio, 
  Select,
  Space,
  Spin,
  Progress,
  InputNumber,
  Alert,
  Steps,
  Checkbox
} from 'antd';
import { 
  MailOutlined, 
  LockOutlined, 
  KeyOutlined, 
  EyeOutlined, 
  EyeInvisibleOutlined, 
  CheckCircleOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  UserOutlined
} from '@ant-design/icons';
import styles from './ForgotPasswordPage.module.css';
import tortoiseAnimation from '../../../assets/tortoise.json';
import axios from 'axios';
import { ApiRequest } from '../../../api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Step } = Steps;

// Sample security questions (in a real app, these would come from the backend)
const securityQuestions = [
  { id: 'q1', question: "What was your childhood nickname?" },
  { id: 'q2', question: "In what city were you born?" },
  { id: 'q3', question: "What is the name of your first pet?" },
  { id: 'q4', question: "What is your mother's maiden name?" },
  { id: 'q5', question: "What high school did you attend?" },
  { id: 'q6', question: "What was the make of your first car?" },
  { id: 'q7', question: "What is your favorite movie?" },
  { id: 'q8', question: "What is your favorite book?" },
  { id: 'q9', question: "What was the street you grew up on?" },
  { id: 'q10', question: "What was the name of your elementary school?" }
];

const ForgotPasswordPage = () => {
  // State variables
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('email'); // email, security, new-password, password, success
  const [currentStepNumber, setCurrentStepNumber] = useState(0); // 0: email, 1: security, 2: new-password, 3: password
  const [userEmail, setUserEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recoveredPassword, setRecoveredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useSecurityQuestions, setUseSecurityQuestions] = useState(false);
  const [securityAnswers, setSecurityAnswers] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Form instance
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle responsive layout with useCallback for better performance
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Function to verify email exists before allowing password reset
  const verifyEmail = async (emailToCheck = null) => {
    // Use the provided email or fall back to the state variable
    const email = emailToCheck || userEmail;
    setLoading(true);
    try {
      console.log('Verifying email exists:', email);
      
      // Make an API call to the backend using ApiRequest
      const response = await ApiRequest.post('/auth/verify-email', { email: email.toLowerCase() });
      
      if (response.data && response.data.success) {
        console.log('Email verified successfully');
        toast.success('Email verified successfully!');
        
        // Check if user wants to use security questions
        if (useSecurityQuestions) {
          setCurrentStep('security');
          setCurrentStepNumber(1);
        } else {
          setCurrentStep('new-password'); // Move to new password input step
          setCurrentStepNumber(2);
        }
        return true;
      } else {
        // Backend returned success: false
        console.log('Email verification failed');
        toast.error('Email verification failed');
        setCurrentStep('email'); // Go back to email input
        setCurrentStepNumber(0);
        return false;
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      toast.error('Error connecting to server. Please try again later.');
      setCurrentStep('email'); // Go back to email input
      setCurrentStepNumber(0);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to verify security questions
  const verifySecurityQuestions = async (answers) => {
    setLoading(true);
    try {
      console.log('Verifying security questions for:', userEmail);
      
      // In a real application, this would be validated against stored answers
      // For this demo, we'll simulate a successful verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the answers
      setSecurityAnswers(answers);
      
      // Move to the next step
      setCurrentStep('new-password');
      setCurrentStepNumber(2);
      toast.success('Security questions verified successfully!');
      return true;
    } catch (error) {
      console.error('Error verifying security questions:', error);
      toast.error('Error verifying security questions. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to reset the password with user-chosen password
  const resetPassword = async (newPasswordValue = null) => {
    const passwordToUse = newPasswordValue || newPassword;
    setLoading(true);
    try {
      console.log('Resetting password for:', userEmail);
      
      // Make an API call to the backend using ApiRequest
      const response = await ApiRequest.post('/auth/recover-password', {
        email: userEmail.toLowerCase(),
        newPassword: passwordToUse,
        securityAnswers: useSecurityQuestions ? securityAnswers : undefined
      });
      
      if (response.data && response.data.success) {
        console.log('Password successfully reset');
        setRecoveredPassword(passwordToUse);
        toast.success('Password has been reset successfully!');
        setCurrentStep('password'); // Move to password display step
        setCurrentStepNumber(3);
        return true;
      } else {
        // Backend returned success: false
        console.log('Password reset failed');
        toast.error('Password could not be reset');
        return false;
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Error connecting to server. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle email submission and verify email
  const handleEmailSubmit = async (values) => {
    setLoading(true);
    
    try {
      // Set the email for password reset
      setUserEmail(values.email);
      
      // Set whether to use security questions
      setUseSecurityQuestions(values.useSecurityQuestions);
      
      // Verify the email exists in the database
      await verifyEmail(values.email);
      
      // The verifyEmail function will handle navigation to the appropriate step
    } catch (error) {
      console.error('Email verification error:', error);
      toast.error('Error verifying email. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle security questions submission
  const handleSecurityQuestionsSubmit = async (values) => {
    setLoading(true);
    
    try {
      // Verify the security questions
      await verifySecurityQuestions({
        question1: values.securityQuestion1,
        answer1: values.securityAnswer1,
        question2: values.securityQuestion2,
        answer2: values.securityAnswer2
      });
      
      // The verifySecurityQuestions function will handle navigation to the appropriate step
    } catch (error) {
      console.error('Security questions error:', error);
      toast.error('Error verifying security questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle new password submission
  const handleNewPasswordSubmit = async (values) => {
    setLoading(true);
    
    try {
      // Set the new password
      setNewPassword(values.newPassword);
      
      // Reset the password with the user-chosen password
      await resetPassword(values.newPassword);
      
      // The resetPassword function will handle navigation to the appropriate step
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle password confirmation
  const handlePasswordConfirm = () => {
    toast.success('Password has been successfully reset!');
    setCurrentStep('success');
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      { title: 'Email Verification', icon: <MailOutlined /> },
      { title: 'Security Questions', icon: <QuestionCircleOutlined /> },
      { title: 'New Password', icon: <LockOutlined /> },
      { title: 'Confirmation', icon: <CheckOutlined /> }
    ];
    
    return (
      <div className={styles.stepIndicator}>
        <Steps 
          current={currentStepNumber} 
          size="small"
          responsive={false}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          {steps.map((step, index) => (
            <Step 
              key={index} 
              title={isMobile ? '' : step.title} 
              icon={step.icon} 
              disabled={index > currentStepNumber}
            />
          ))}
        </Steps>
      </div>
    );
  };

  // Render different form content based on current step
  const renderFormContent = () => {
    switch (currentStep) {
      case 'email':
        return (
          <>
            {renderStepIndicator()}
            
            <div className={styles.formHeader}>
              {/* <div className={styles.formLogo}>
                <img src="/logo.png" alt="Pet Care Logo" />
              </div> */}
              <Title level={2} className={styles.pageTitle}>Forgot Password</Title>
              <Paragraph type="secondary" className={styles.pageSubtitle}>
                Enter your email address to reset your password
              </Paragraph>
            </div>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleEmailSubmit}
              requiredMark={false}
              size="large"
              initialValues={{ useSecurityQuestions: false }}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
                help="We'll verify this email in our system"
              >
                <Input 
                  prefix={<MailOutlined className={styles.inputIcon} />}
                  placeholder="Enter your email address"
                  size="large"
                  autoComplete="email"
                />
              </Form.Item>
              
              <Form.Item name="useSecurityQuestions" valuePropName="checked">
                <Checkbox>
                  Use security questions for additional verification
                </Checkbox>
              </Form.Item>
              
              <Form.Item style={{ marginBottom: '12px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  block 
                  loading={loading}
                  icon={<MailOutlined />}
                  className={styles.submitButton}
                  size="large"
                >
                  {loading ? 'Verifying Email...' : 'Verify Email'}
                </Button>
              </Form.Item>
              
              <Divider className={styles.formDivider}>or</Divider>
              
              <Form.Item style={{ marginBottom: '0', textAlign: 'center' }}>
                <Link to="/auth/login">Back to Login</Link>
              </Form.Item>
            </Form>
          </>
        );
        
      case 'security':
        return (
          <>
            {renderStepIndicator()}
            
            <div className={styles.formHeader}>
              <Title level={2} className={styles.pageTitle}>Security Verification</Title>
              <Paragraph type="secondary" className={styles.pageSubtitle}>
                Please answer these security questions to verify your identity
              </Paragraph>
            </div>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSecurityQuestionsSubmit}
              requiredMark={false}
              size="large"
            >
              <div className={styles.securityQuestions}>
                <Form.Item
                  name="securityQuestion1"
                  label="Question 1"
                  rules={[{ required: true, message: 'Please select a security question' }]}
                >
                  <Select 
                    placeholder="Select a security question"
                    size="large"
                  >
                    {securityQuestions.slice(0, 5).map(q => (
                      <Option key={q.id} value={q.id}>{q.question}</Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="securityAnswer1"
                  rules={[{ required: true, message: 'Please provide your answer' }]}
                >
                  <Input 
                    prefix={<SafetyCertificateOutlined className={styles.inputIcon} />}
                    placeholder="Your answer" 
                    autoComplete="off"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item
                  name="securityQuestion2"
                  label="Question 2"
                  rules={[{ required: true, message: 'Please select a security question' }]}
                >
                  <Select 
                    placeholder="Select a security question"
                    size="large"
                  >
                    {securityQuestions.slice(5, 10).map(q => (
                      <Option key={q.id} value={q.id}>{q.question}</Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="securityAnswer2"
                  rules={[{ required: true, message: 'Please provide your answer' }]}
                >
                  <Input 
                    prefix={<SafetyCertificateOutlined className={styles.inputIcon} />}
                    placeholder="Your answer" 
                    autoComplete="off"
                    size="large"
                  />
                </Form.Item>
              </div>
              
              <Form.Item style={{ marginBottom: '12px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  block 
                  loading={loading}
                  icon={<QuestionCircleOutlined />}
                  className={styles.submitButton}
                  size="large"
                >
                  {loading ? 'Verifying Answers...' : 'Verify Answers'}
                </Button>
              </Form.Item>
              
              <Form.Item style={{ marginBottom: '0', textAlign: 'center' }}>
                <Button 
                  type="link" 
                  onClick={() => {
                    setCurrentStep('email');
                    setCurrentStepNumber(0);
                  }}
                >
                  <ArrowLeftOutlined /> Back to Email Verification
                </Button>
              </Form.Item>
            </Form>
          </>
        );
        
      case 'new-password':
        return (
          <>
            {renderStepIndicator()}
            
            <div className={styles.formHeader}>
              <Title level={2} className={styles.pageTitle}>Choose New Password</Title>
              <Paragraph type="secondary" className={styles.pageSubtitle}>
                Create a new password for your account: <strong>{userEmail}</strong>
              </Paragraph>
            </div>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleNewPasswordSubmit}
              requiredMark={false}
              size="large"
            >
              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: 'Please enter a new password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
                help="Choose a strong password with at least 6 characters"
              >
                <Input.Password 
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="Enter your new password"
                  size="large"
                  autoComplete="new-password"
                />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="Confirm Password" 
                  size="large"
                  autoComplete="new-password"
                />
              </Form.Item>
              
              <Form.Item style={{ marginBottom: '12px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  block 
                  loading={loading}
                  icon={<KeyOutlined />}
                  className={styles.submitButton}
                  size="large"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </Form.Item>
              
              <Form.Item style={{ marginBottom: '0', textAlign: 'center' }}>
                <Button 
                  type="link" 
                  onClick={() => {
                    if (useSecurityQuestions) {
                      setCurrentStep('security');
                      setCurrentStepNumber(1);
                    } else {
                      setCurrentStep('email');
                      setCurrentStepNumber(0);
                    }
                  }}
                >
                  <ArrowLeftOutlined /> Back
                </Button>
              </Form.Item>
            </Form>
          </>
        );
        
      case 'password':
        return (
          <>
            {renderStepIndicator()}
            
            <div className={styles.formHeader}>
              <Title level={2} className={styles.pageTitle}>Password Reset Complete</Title>
              <Paragraph type="secondary" className={styles.pageSubtitle}>
                Your password has been successfully reset for <strong>{userEmail}</strong>
              </Paragraph>
              <Alert
                message="New Password"
                description="This is your new password. You can use it to log in immediately."
                type="success"
                showIcon
                className={styles.securityAlert}
              />
            </div>
            
            {loading ? (
              <div className={styles.loadingContainer}>
                <Spin size="large" />
                <Paragraph style={{ marginTop: 16 }}>Finalizing your password reset...</Paragraph>
              </div>
            ) : (
              <div className={styles.passwordContainer}>
                <div className={styles.passwordDisplay}>
                  <Input.Password
                    value={recoveredPassword}
                    visibilityToggle={{ visible: showPassword, onVisibleChange: togglePasswordVisibility }}
                    prefix={<KeyOutlined className={styles.keyIcon} />}
                    readOnly
                    size="large"
                    addonAfter={
                      <Button 
                        type="text" 
                        icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={togglePasswordVisibility}
                        className={styles.visibilityButton}
                      />
                    }
                  />
                </div>
                
                <Paragraph type="secondary" className={styles.passwordNote}>
                  This is your new password. Please save it in a secure location.
                </Paragraph>
                
                <Space direction="vertical" style={{ width: '100%', marginTop: '20px' }}>
                  <Button 
                    type="primary" 
                    block 
                    icon={<CheckCircleOutlined />}
                    onClick={handlePasswordConfirm}
                    className={styles.submitButton}
                    size="large"
                  >
                    I've Saved My Password
                  </Button>
                  
                  <Button 
                    type="link" 
                    block
                    onClick={() => window.location.href = '/login'}
                  >
                    Go to Login Page
                  </Button>
                </Space>
              </div>
            )}
          </>
        );
        
      case 'success':
        return (
          <>
            {renderStepIndicator()}
            
            <div className={styles.successMessage}>
              <div className={styles.iconContainer}>
                <CheckCircleOutlined className={styles.mailIcon} />
              </div>
              <Title level={3} className={styles.pageTitle}>Password Reset Successfully</Title>
              <Paragraph>
                You can now use your new password to log in to your account.
              </Paragraph>
              <Paragraph type="secondary">
                For security reasons, please change your password after logging in.
              </Paragraph>
              
              <Button 
                type="primary" 
                size="large"
                icon={<UserOutlined />}
                onClick={() => window.location.href = '/login'}
                className={styles.submitButton}
                style={{ marginTop: '24px' }}
              >
                Go to Login
              </Button>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  // State to track if tortoise animation is loaded
  const [tortoiseAnimationData, setTortoiseAnimationData] = useState(tortoiseAnimation);
  
  return (
    <div className={styles.forgotPasswordContainer}>
      <div className={styles.navBackButtonContainer}>
        <Link to="/login">
          <Button 
            icon={<ArrowLeftOutlined />} 
            className={styles.backButton}
            size="large"
          >
            Back to Login
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
            <Lottie 
              animationData={tortoiseAnimation}
              loop={true}
              style={{ width: '300px', height: '300px' }}
            />
            <div className={styles.animationCaption}>
              <h3>Password Recovery</h3>
              <p>We'll help you reset your password safely</p>
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
              className={styles.forgotPasswordCard}
            >
              <div className={styles.formHeader}>
                <Title level={2}>Reset Password</Title>
                <Paragraph type="secondary">Follow the steps to recover your account</Paragraph>
              </div>
              {renderFormContent()}
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPasswordPage;
