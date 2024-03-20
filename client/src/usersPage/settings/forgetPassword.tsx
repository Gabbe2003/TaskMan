import { useEffect, useState } from 'react';
import { handleForgetPassword } from './userSettingsCalls/API_components/forgetPwdComponent';
import { toast } from 'react-toastify';

interface IEmailModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgetPasswordModal: React.FC<IEmailModelProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => e.key === 'Escape' ? onClose() : null;
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [onClose]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form from causing a page reload
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    try {
      await handleForgetPassword(email);
      setEmail('');
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className={`modal fade ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content" style={{ backgroundColor: '#f8f9fa' }}> 
          <div className="modal-header">
            <h5 className="modal-title">Forgot Password</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Please enter your email address to receive a link to reset your password.</p>
            <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Your email"
              className="form-control"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ForgetPasswordModal;
