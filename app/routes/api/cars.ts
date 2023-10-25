import { json, type LoaderFunction } from "@remix-run/node"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export let loader: LoaderFunction =async({request}) => {
    const cars = await prisma.car.findMany();

    return json(cars);
}
