import { Input } from '../components'

function Email({register,className, }) {
  return (
    <div>
      <Input
            placeholder="Email Address"
            register={register}
            name="email"
            className={className}
            extraFormFeatures={{
              required: {
                value: true,
                message: "Email is required",
              
              },
              pattern: {
                value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message:"Invalid email format"
              },
              maxLength: {
                value: 50,
                message: "Email must not exceed 50 characters",
              },
            }}
            label="Email"
            labelClassname=""
            type="text"
          />
    </div>
  )
}

export default Email