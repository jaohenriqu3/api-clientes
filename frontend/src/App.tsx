import { useEffect, useState, useRef, FormEvent } from "react"
import { FiTrash } from "react-icons/fi"
import { api } from "./services/api"

interface CustomerProps{
  id: string; 
  name: string; 
  email: string; 
  status: boolean; 
  created_at: string; 
}

export default function App(){

  const [customers, setCustomers] = useState<CustomerProps[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadCustomers()
  }, []) 

  async function loadCustomers() {
    const response = await api.get("/customers") 
    setCustomers(response.data);
  }

  async function handleSubmit(event: FormEvent){ 
    event.preventDefault(); 

    if(!nameRef.current?.value || !emailRef.current?.value) return;

    const response = await api.post("/customer", {
      name: nameRef.current?.value, 
      email: emailRef.current?.value,
    })

    setCustomers(allCustomers => [...allCustomers, response.data])

    nameRef.current.value = ""
    emailRef.current.value = ""
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/customer", {
        params: {
          id: id, 
        }
      }) 

      const allCustomers = customers.filter( (customers) => customers.id !== id)
      setCustomers(allCustomers)

    } catch (err) {
      console.log(err)
    }
  }

  return( 
  <div className="w-full min-h-screen bg-gray-800 flex justify-center px-4">
    <main className="my-10 w-full md:max-w-2xl" > 
      <h1 className="text-4xl font-medium  text-white flex justify-center" > Clientes </h1>

      <form className="flex flex-col my-6" onSubmit={handleSubmit}>  
        <label  className="font-medium text-white"> Nome: </label>
        <input type="text" 
        placeholder="Digite seu nome:" 
        className="w-full mb-5 p-2 rounded"
        ref={nameRef}
        /> 

        <label  className="font-medium text-white"> E-mail: </label>
        <input type="text" 
        placeholder="Digite seu e-mail:" 
        className="w-full mb-5 p-2 rounded"
        ref={emailRef}
        />

        <input type="submit" 
        value="Cadastrar" 
        className="cursor-pointer w-full p-2 bg-green-300 rounded font-medium" />
      </form> 

    <section className="flex flex-col gap-4">
        {customers.map( (customer) => ( 
          <article key={customer.id} 
          className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">

          <p> <span className="font-medium ">Nome: </span> {customer.name}</p>
          <p> <span className="font-medium ">E-mail: </span> {customer.email}</p>
          <p> <span className="font-medium ">Nome: </span> {customer.status ? "ATIVO" : "INATIVO"} </p>
  
          <button 
          className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2" 
          onClick={() => handleDelete(customer.id)}
          > 
             <FiTrash size={18} color="#FFFFFF"/>
          </button>
  
        </article>
      ))}
    </section>

    </main>
  </div>
  )
}