import SignIn from './components/SignIn/Signin.jsx';
import {Button, Logo} from './components/components.js';
function App() {
  return (
    <div className="bg-[#131314] h-screen flex justify-between py-4 px-8">
      <Logo />
      <Button />
      <SignIn />
    </div>
  )
}

export default App
