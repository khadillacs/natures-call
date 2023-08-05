import { Form, useLoaderData } from "react-router-dom";
import{useState} from 'react';



export async function loader({ params }) {
  const bathroomResponse = await fetch(`http://localhost:4000/bathroom/${params.id}`);
  const bathroom = await bathroomResponse.json();



  return { bathroom };
}
export default function EditBathroom(){
    const { bathroom } = useLoaderData();

    const [brState, setBrState] = useState(bathroom);

    //this will happen when user changes input
  const handleInput = (e) => {
    setBrState((brState) => {
      return {
        ...brState,
        [e.target.name]: e.target.value,
      };
    });
  };


  const handleAddBookFormSubmit = async (e) => {
    e.preventDefault();

    const preparedBathroom = {
      //add more if needed
      address: brState.address,
      name: brState.name,
      unisex: brState.unisex,
      emergencyCord: brState.emergencyCord,
      emergencyButton:brState.emergencyButton,
      petFriendly:brState.petFriendly
      
    };
    // new job should be added to the DOM
    const response = await fetch(`http://localhost:4000/bathrooms/${brState.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preparedBathroom),
    });
    const newestBathroom = await response.json();
    
    onAddBooks(newestBook);
    
    setBookState(newestBathroom);
   // hideForm();
  };


  return (
    <>
    <Form method="post" className="p-8 bg-blue-200 text-black rounded">
            <h1 className="text-2xl font-bold text-center mb-8">Add A Bathroom!</h1>
    
         <fieldset>   
       <div className="flex flex-col gap-4 mb-4">
        <textarea
          id="address"
          name="address"
          className="border-2 border-blue-500 p-2 rounded"
          rows="1"
          placeholder="Enter the address here"
        />
      </div> 
        </fieldset>

     <fieldset>   
       <div className="flex flex-col gap-4 mb-4">
        <textarea
          id="name"
          name="name"
          className="border-2 border-blue-500 p-2 rounded"
          rows="1"
          placeholder="Enter the name here"
        />
      </div> 
        </fieldset>

            <fieldset className="mb-8">
                <legend className="text-lg font-semibold mb-2">Is it Unisex?</legend>
                <div className="flex items-center space-x-4">
                    <input type="radio" id="unisexYes" name="unisex" value="1" />
                    <label htmlFor="unisexYes" className="mr-4 dark:text-gray-300">Yes</label>
                    <input type="radio" id="unisexNo" name="unisex" value="0" />
                    <label htmlFor="unisexNo" className="mr-4 dark:text-gray-300">No</label>
                    <input type="radio" id="unisexUnknown" name="unisex" value="3" defaultChecked />
                    <label htmlFor="unisexUnknown" className="dark:text-gray-300">Unknown</label>
                </div>
            </fieldset>

            <fieldset className="mb-8">
                <legend className="text-lg font-semibold mb-2">Does it have an Emergency Cord?</legend>
                <div className="flex items-center space-x-4">
                    <input type="radio" id="emergencyCordYes" name="emergencyCord" value="1" />
                    <label htmlFor="emergencyCordYes" className="mr-4 dark:text-gray-300">Yes</label>
                    <input type="radio" id="emergencyCordNo" name="emergencyCord" value="0" />
                    <label htmlFor="emergencyCordNo" className="mr-4 dark:text-gray-300">No</label>
                    <input type="radio" id="emergencyCordUnknown" name="emergencyCord" value="3" defaultChecked />
                    <label htmlFor="emergencyCordUnknown" className="dark:text-gray-300">Unknown</label>
                </div>
            </fieldset>

            <fieldset className="mb-8">
                <legend className="text-lg font-semibold mb-2">Does it have an Emergency Button?</legend>
                <div className="flex items-center space-x-4">
                    <input type="radio" id="emergencyButtonYes" name="emergencyButton" value="1" />
                    <label htmlFor="emergencyButtonYes" className="mr-4 dark:text-gray-300">Yes</label>
                    <input type="radio" id="emergencyButtonNo" name="emergencyButton" value="0" />
                    <label htmlFor="emergencyButtonNo" className="mr-4 dark:text-gray-300">No</label>
                    <input type="radio" id="emergencyButtonUnknown" name="emergencyButton" value="3" defaultChecked />
                    <label htmlFor="emergencyButtonUnknown" className="dark:text-gray-300">Unknown</label>
                </div>
            </fieldset>

            <fieldset className="mb-8">
                <legend className="text-lg font-semibold mb-2">Is it Pet Friendly?</legend>
                <div className="flex items-center space-x-4">
                    <input type="radio" id="petFriendlyYes" name="petFriendly" value="1" />
                    <label htmlFor="petFriendlyYes" className="mr-4 dark:text-gray-300">Yes</label>
                    <input type="radio" id="petFriendlyNo" name="petFriendly" value="0" />
                    <label htmlFor="petFriendlyNo" className="mr-4 dark:text-gray-300">No</label>
                    <input type="radio" id="petFriendlyUnknown" name="petFriendly" value="3" defaultChecked />
                    <label htmlFor="petFriendlyUnknown" className="dark:text-gray-300">Unknown</label>
                </div>
            </fieldset>

            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4 w-full"
            >
                Submit Review
            </button>
        </Form>
    
    </>
  );
}