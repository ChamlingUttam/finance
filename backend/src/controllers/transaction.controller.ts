import { execSync } from "node:child_process"
import {prisma} from "../libs/prisma.js"
import { Request,Response } from "express"
// import {startOfWeek,startOfMonth,startOfDay,endOfDay} from  "date-fns"

export const createTransaction = async(req:Request,res:Response)=>{

    const {type,category,date,amount} = req.body
    const userId = req.user.id

    try {
        if(!type || !category  || !amount){
            res.status(400).json({message:"all fields are required"})
        }

        if(!["INCOME","EXPENSE"].includes(type)){
            res.status(400).json({message:"transaction type must be INCOME  or EXPENSE"})
        }

        const transaction  = await prisma.transaction.create({
            data:{
                userId,
                type,category,amount:parseInt(amount),
                date: date?new Date(date):new Date()
            },
        })

        res.status(201).json(transaction)

        
    } catch (error:unknown) {
        if( error instanceof Error){
            res.status(500).json({message:"server error ",error})
        }
        else{
            res.status(500).json({message:"server error"})
        }
        
    }

}


export const getTransaction  = async (req:Request,res:Response)=>{

    const userId = req.user.id
    try {
        
        const transaction = await prisma.transaction.findMany({
            where:{
                userId
            }
        }) 

        res.status(200).json(transaction)
    } catch (error) {
        res.status(500).json({message:"server error ",error})
    }
}

export const getCategoryTransaction = async (
  req: Request,
  res: Response
) => {
  const { amount, category, type } = req.query;
//   const { id } = req.params;
  const userId = req.user.id;

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        // id: Number(id),
        userId,

        ...(type && {
          type: type as "INCOME" | "EXPENSE",
        }),

        ...(category && {
          category: category as string,
        }),

        ...(amount && {
          amount: Number(amount),
        }),
      },
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};


 export  const updateTransaction = async (req:Request,res:Response)=>{

    const {category,type,amount,date} = req.query
    const userId = req.user.id

    try {

        const existing = await prisma.transaction.findFirst({
            id:parseInt(id),userId
        })

        if(!existing){
            res.status(400).json({message:"transaction not found"})
        }

        const transaction = await prisma.transaction.update({
           where:{id:parseInt(id)},
           data:{
            ...(amount && {amount:parseFloat(amount)}),
            ...(type && {type}),
            ...(category && {category}),
            ...(date && {date:new Date()})

           }
        })

        res.status(200).json(transaction)
        
    } catch (error) {
        res.status(500).json({message:"server error in update",error})
    }
}


export const deleteTransaction = async(req:Request,res:Response)=>{

    const userId = req.user.id
    const {id} = req.params

    try {
        const existing = await prisma.transaction.findFirst({
            id:parseInt(id),
            userId
        })

        if(!existing){
            res.status(400).json({message:"user transaction not found "})
        }

        await prisma.transaction.delete({
            where:{
                id:parseInt(id)
            }
        })

        res.status(200).json({message:"successfully deleted the transaction"})
    } catch (error) {
        res.status(500).json({message:"server error in delete",error})
    }

}