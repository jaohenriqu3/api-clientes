import prismaClient from "../prisma"; 

interface CreateCustomeProps{
    name: string; 
    email: string
}

class CreateCustomerService{
    async execute({ name, email} : CreateCustomeProps){
        console.log("ROTA EFETUADA") 

        if(!name || !email){
            throw new Error("Preencha todos os campos")
        }

        const customer = await prismaClient.customer.create({
            data:{
                name,
                email,
                status: true
            }
        })

        return customer 
    }
}

export {CreateCustomerService}