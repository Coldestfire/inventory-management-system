import { ErrorMessage, Field, Formik } from 'formik'
import { Button } from 'primereact/button' 
import   { useRef } from 'react' 
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useRegisterUserMutation } from '../provider/queries/Auth.query'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import ReCAPTCHA from 'react-google-recaptcha'

const Register = () => {

  const [registerUser,registerUserResponse] = useRegisterUserMutation()

  const navigate  = useNavigate()

  const RecaptchaRef = useRef<any>();

  type User = {
    token:string;
    name: string,
    email: string,
    password: string
  }

  const initialValues: User = {
    name: '',
    token:'',
    email: '',
    password: ''
  }

  const validationSchema = yup.object({
    name: yup.string(). required("Name is required"),
    email: yup.string().email("email must be valid").required("email is required"),
    password: yup.string().min(5, "Password must be grather than 5 characters").required("password is required"),
  })

  const OnSubmitHandler = async (e: User, { resetForm }: any) => {
    console.log({ e });

    try {
        // Pass the user object, including the captcha token
        const { data, error }: any = await registerUser(e);

        if (error) {
            toast.error(error.data.message); // Display error message
            return;
        }

        console.log(data, error);

        localStorage.setItem("token", data.token);

        toast.success("Registered Successfully");

        resetForm();
        navigate("/");
    } catch (error: any) {
        toast.error(error.message); // Handle other exceptions
    } finally {
        RecaptchaRef.current.reset(); // Reset the captcha
    }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full bg-primary">
      {/* Title Section */}
      
      <motion.h1 className="text-9xl text-[#5B4636] mb-3 tracking-wide font-stylish"
      initial={{ opacity: 0, y: -30 }} // Start above and invisible
      animate={{ opacity: 1, y: 0 }} // Animate to original position
      transition={{ duration: 1 }} // Set duration for smooth transition
      >
       Caffy
      </motion.h1>
     
      <motion.p
        className='text-[#5B4636] font-semibold tracking-wide mb-7'
        initial={{ opacity: 0, y: -20 }} // Start below and invisible
        animate={{ opacity: 1, y: 0 }} // Animate to original position
        transition={{ duration: 1 }} // Delay the subtitle for a staggered effect
      >
        The best way to manage your inventory and orders
      </motion.p>



  
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={OnSubmitHandler}>
        {({ values, setFieldValue, handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="w-[96%] md:w-[70%] lg:w-1/3 shadow-md rounded-md pt-10 pb-3 px-4 bg-secondary"
          >
            <div className="mb-3 py-1">
              <label htmlFor="name">Name</label>
              <Field
                id="name"
                name="name"
                className="w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg"
                placeholder="Enter Email Address"
              />
              <ErrorMessage component="p" className="text-red-500 text-sm" name="name" />
            </div>
  
            <div className="mb-3 py-1">
              <label htmlFor="email">Email</label>
              <Field
                id="email"
                name="email"
                className="w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg"
                placeholder="Enter Email Address"
              />
              <ErrorMessage component="p" className="text-red-500 text-sm" name="email" />
            </div>
  
            <div className="mb-3 py-1">
              <label htmlFor="password">Password</label>
              <Field
                name="password"
                id="password"
                className="w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg"
                placeholder="*****"
              />
              <ErrorMessage component="p" className="text-red-500 text-sm" name="password" />
            </div>
  
            <div className="mb-3 py-1">
              {/* ReCAPTCHA can be added here if needed */}
              <ReCAPTCHA
    ref={RecaptchaRef}
    sitekey={import.meta.env.VITE_SITE_KEY}
    onChange={(value) => {
        setFieldValue("token", value); // Pass the token to Formik
    }}
/>

            </div>
  
            <div className="mb-3 py-1">
              <Button
                loading={registerUserResponse.isLoading}
                raised
                type="submit"
                className="w-full bg-accent text-white py-3 px-2 flex items-center justify-center hover:opacity-85"
                disabled={!values.token}
              >
                Submit
              </Button>
            </div>
  
            <div className="mb-3 py-1 flex items-center justify-end">
              <p className="inline-flex items-center gap-x-1">
                Already Have An Account?
                <Link className="font-semibold" to={"/login"}>
                  Login
                </Link>
              </p>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Register