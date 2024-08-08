
import { Link } from 'react-router-dom'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

function AuthToggle({type}) {
  return (
    type === 'login' ? (
      <div className='flex gap-2 items-center'>
        <p> Don&#39;t have an account?</p>
        <Link to={"/signup"} className='font-semibold tracking-widest cursor-pointer'>
          Sign up
          <ArrowRightAltIcon />
        </Link>
      </div>
    ) : (
      <div className='flex gap-2 items-center'>
        Have an account? 
        <Link to={"/login"} className='font-semibold tracking-wider'>
          Log in
          <ArrowRightAltIcon />
        </Link>
      </div>
      )
  )
}

export default AuthToggle