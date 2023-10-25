import { json, type LoaderFunction } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";

const prisma = new PrismaClient();

export let loader: LoaderFunction = async () => {
  const cars = await prisma.car.findMany();
  return json({ cars });
};

export default function Homepage() {
  const { cars = [] } = useLoaderData();
  const newDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const displayedMoreInfoSet = new Set();

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          Toyota Cars Recently Listed on Mekina.com
        </h1>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cars.map(({ id, name, price, posted, more_info, created_at }) => {
            if (displayedMoreInfoSet.has(more_info)) {
              return null; // Skip rendering this card
            }

            const isRecent = new Date(created_at) <= newDate;

            if (isRecent) {
              displayedMoreInfoSet.add(more_info); // Mark more_info as displayed
            }

            return (
              <li
                key={id}
                className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:shadow-lg"
              >
                {isRecent ? (
                  <div className="p-4">
                    <h2 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                      {name}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 hover:text-blue-500">
                      Price: {price}
                    </p>
                    <p className="mt-2 text-sm text-gray-500 hover:text-blue-500">
                      Date posted: {posted}
                    </p>
                    <a
                      href={more_info}
                      className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      More Info: {more_info}
                    </a>
                  </div>
                ) : (
                  <h1 className="px-4 py-3 text-xl font-bold text-red-500 hover:text-blue-600">
                    Nothing new to show
                  </h1>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
