import { ErrorMessage, Field, Formik } from 'formik'
import { Button } from 'primereact/button' 
import  { useRef } from 'react' 
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useLoginUserMutation } from '../provider/queries/Auth.query'
import { toast } from 'sonner'
import { motion } from 'framer-motion';
import ReCAPTCHA from "react-google-recaptcha";
const Login = () => {
const [LoginUser,LoginUserResponse] = useLoginUserMutation()
const navigate = useNavigate()
  type User={
    token:string,
    email:string,
    password:string
  }

  
  const RecaptchaRef = useRef<any>();

  const initialValues: User={
    token: '',
    email: '',
    password:''
  }

  const validationSchema =yup.object({
    email: yup.string().email("*Email must be valid").required("*Email is required"),
    password: yup.string().min(6,"*Password must be greater than 6 characters").required("*Password is required"),
  })

  const OnSubmitHandler = async(e:User,{resetForm}:any)=>{

    try {
 
      const { data, error }: any = await LoginUser(e)
      if (error) {
        toast.error(error.data.message);
        return

      }

      console.log(data,error);


      localStorage.setItem("token", data.token);

      console.log("token: ", data.token);

      toast.success("Logged in Successfully",{duration: 1000});   
      

      resetForm()
      navigate("/")
      window.location.reload()
    } catch (error: any) {
      // toast
      toast.error(error.message);

    }finally{
      RecaptchaRef.current.reset();
    }
  }


  return (

    <>

      <div className='min-h-screen flex flex-col items-center justify-center w-full bg-primary'>
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
            <>
              <form onSubmit={handleSubmit} className="w-[96%] md:w-[70%] lg:w-1/3 shadow-md rounded-md pt-10 pb-3 px-4 bg-secondary">
                <div className="mb-3 py-1">
                  <label htmlFor="email">Email</label>
                  <Field id='email' name='email' className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg' placeholder='Enter An Email Address' />
                  <ErrorMessage component={'p'} className='text-red-500 text-md' name='email' />
                </div>
                <div className="mb-3 py-1">
                  <label htmlFor="password">Password</label>

                  <Field name='password' id='password' className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg' placeholder='*********' />
                  <ErrorMessage component={'p'} className='text-red-500 text-md ' name='password' />

                </div>
                <div className="mb-3 py-1">
                  <ReCAPTCHA
                    ref={RecaptchaRef}
                    sitekey={import.meta.env.VITE_SITE_KEY}
                    onChange={(e) => { setFieldValue('token',e)}}
                  />
                </div>
                <div className="mb-3 py-1 flex items-center justify-center">
                  <Button  disabled={!values.token} loading={LoginUserResponse.isLoading} raised className='w-full bg-accent text-white py-3 px-2 flex items-center justify-center hover:opacity-85'>
                  
                  Submit
                  </Button>
                </div>
                <div className="mb-3 py-1 flex items-center justify-end">
                  <p className="inline-flex items-center gap-x-1">   Don't Have An Account?<Link className='font-semibold' to={'/register'}>Register</Link></p>
                </div>
                <div className="mb-3 py-1 flex items-center justify-end">
                 
                </div>
              </form>
            </>
          )}
        </Formik>
      </div>
    
    </>

  )
}

export default Login