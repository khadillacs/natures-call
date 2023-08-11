import React from "react";
import { Link, NavLink, useLoaderData, useNavigate} from "react-router-dom";
import { Outlet, redirect  } from "react-router-dom";
import {useState, useEffect} from "react";
// import axios from "axios";
import './Profile.css';

import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export async function loader({ params }) {


  try {
    const [allBathroomsResponse,profileresponse ,reviewsResponse, bathroomsResponse,] = await Promise.all([
      fetch(`/api/userProfileData/bathrooms`),
      fetch(`/api/userProfileData/userData`),
      fetch(`/api/userProfileData/myReviews`),
      fetch(`/api/userProfileData/myBathrooms`),//fetching user bathrooms (uses session id from server.js , using authnetication)
    ]);

    const allBathrooms = await allBathroomsResponse.json();
    const profileData = await profileresponse.json();
    const reviewsData = await reviewsResponse.json();
    const userBathrooms = await bathroomsResponse.json();
   
    
  
  
    console.log("all bathrooms response call: ", allBathrooms);
    console.log("User Bathrooms:", userBathrooms);
    console.log("Reviews Data:", reviewsData);
    console.log("User Profile Data", profileData);

    // Do additional processing with the data if needed.

    return { allBathrooms,  profileData, reviewsData, userBathrooms };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}



export default function Profile() {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  console.log("Profile Component Loaded In main.jsx");
  
  const navigate = useNavigate();
const { allBathrooms,  profileData, reviewsData, userBathrooms } = useLoaderData();
console.log("profille photo", profileData.photo);
const getBathroomNameById = (BathroomId) => {
  console.log('Review BathroomId:', BathroomId, typeof BathroomId);
  const bathroom = allBathrooms.find((bathroom) => {
    return Number(bathroom.id) === Number(BathroomId); // Added "return"
  });

  return bathroom ? bathroom.name : "Unknown Bathroom. Bathroom may be deleted :( ";
};


const handleDeleteBathroom = async (bathroomId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this bathroom?");
  if (confirmDelete) {
    setDeleteInProgress(true);
  try {
    const response = await fetch(`/api/bathroomActions/bathrooms/${bathroomId}`, {
      method: "DELETE",
      headers: {

        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: profileData.user.id }), // Pass the user ID in the body
    });
  
    if (response.ok) {
      // Update the userBathrooms state to remove the deleted bathroom
      setUpdatedProfileData(prevData => ({
        ...prevData,
        userBathrooms: userBathrooms.filter(bathroom => bathroom.id !== bathroomId),
        // Make sure to update other properties if needed
      }));
    
  
      
      // You can navigate to a different page or refresh the data here
      navigate('/profile');
    } else {
      console.error("Failed to delete bathroom");
    }
  } catch (error) {
    console.error("Error deleting bathroom:", error);
  }
  setDeleteInProgress(false);
}
};


const [newProfilePhoto, setNewProfilePhoto] = useState(""); // State to manage new profile photo URL
const [profilePhotoKey, setProfilePhotoKey] = useState(0);

// Update the state for updated profile data
const [updatedProfileData, setUpdatedProfileData] = useState(profileData);
const handleProfilePhotoUpdate = async () => {
  try {
    // Send the updated profile photo URL to your backend API for user data update
    console.log("fetched profileD userId", profileData.user.id);
    const response = await fetch(`/api/userProfileData/user/updateprofilepic`, {
      method: "PATCH", // Use the appropriate HTTP method
      headers: {
        "Content-Type": "application/json",
        // Add any necessary headers, like authorization token
      },
      body: JSON.stringify({
   
        userId: profileData.user.id, // Replace with actual user ID
        newProfilePhoto: newProfilePhoto,
      }),

    });

    if (response.ok) {
      // Assuming the backend returns updated user data
      const updatedData = await response.json();
      setUpdatedProfileData(updatedData);
      setProfilePhotoKey(prevKey => prevKey + 1); // Update the key
   // Update the profile photo URL in the component state
  
   setUpdatedProfileData(prevData => ({
    ...prevData,
    user: {
      ...prevData.user,
      photo: newProfilePhoto,
    },
 
  }));
  
    } else {
      console.error("Failed to update profile photo");
    }
  } catch (error) {
    console.error("Error updating profile photo:", error);
  }
  return redirect("/");
};


  return (

    <div>
  <Link to="/" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
        Back To Home
      </Link>
    <h1 className="profile-header">Welcome Back, {profileData.user.name}</h1>
    {/* show profile photo */}
   
    
      <div className="profile-container">
      {/* Profile Photo Section */}
      <div className="profile-photo-section" >
        <h2 className = "profile-photo-title">Update Profile Photo</h2>
        <input
          type="text"
          placeholder="Enter Image URL"                                                                 
          value={newProfilePhoto}
          onChange={(e) => setNewProfilePhoto(e.target.value)}
        />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "8vh" }}>
  <button 
    className="update-photo-button py-2 px-3 text-white bg-blue-500 rounded hover:bg-blue-600"
    onClick={handleProfilePhotoUpdate}
  >
    Update Photo
  </button>
</div>
      </div>
      </div>
  {/* Style the profile photo */}
<div className="profile-photo-container"style={{ marginBottom: "30px" }}>
<img
          key={profilePhotoKey} // Use the profilePhotoKey as the key
          className="profile-photo-image"
          src={updatedProfileData.user.photo} // Use updatedProfileData here
          alt="Profile Pic"
        />
</div>

    <div className = "reviewandbathroomcount">

    <p >Username: {profileData.user.name}</p>
  <p >Email: {profileData.user.email}</p>
    <p>You posted a total of {userBathrooms.length} bathroom(s)</p>
    <p>You posted a total of {reviewsData.length} review(s)</p>
   

    {/* <img src={profileData.photo}  /> */}
    </div>
    <div className="bathrooms-reviews-container">
   { /*bathrooms*/}
    <div className="bathrooms-container">
       <h2 className = "bathroom-header"> Your Bathrooms </h2>
      {userBathrooms.map((bathroom)  => (
        <div key={bathroom.id} className="bathroom-item">
           <p>
      Name:{" "}
      <Link className="bathroom-link" to={`/bathrooms/${bathroom.id}`}>
        {bathroom.name}
      </Link>
    </p>
          <p>Address: {bathroom.address}</p>
          {/* <p>Bathroom ID: {bathroom.id}</p> */}
          <p>Rating: {bathroom.rating !== null ? bathroom.rating + " stars" : "No rating yet"}</p>
          <p>Content: {bathroom.content !== null ? bathroom.content : "No content available"}</p>
          {/* <p>lat: {bathroom.lat}</p>
          <p>lng: {bathroom.lng}</p> */}
          <p>Date Created: {bathroom.createdAt}</p>
          {bathroom.updatedAt !== bathroom.createdAt && ( // Check if updatedAt is different from createdAt
        <p>Date Updated: {bathroom.updatedAt}</p>
      )}
      <button onClick={() => handleDeleteBathroom(bathroom.id)} disabled={deleteInProgress}>
  {deleteInProgress ? "Deleting..." : "Delete"}
</button>

          {/* <img src={bathroom.photo} alt={`Photo of ${bathroom.name}`} /> */}
          {/* Render other bathroom details here */}
         
          <hr />
          <button  className="edit-button">
            <Link to={`/editBathroom/${bathroom.id}`}> Edit Me</Link></button>

        </div>
      ))}
    </div>
        {/*reviews*/}
        <div className="reviews-container">
       <h2 className = "review-header"> Your Reviews </h2>
      {reviewsData.map((review) => (
        <div key={review.id} className="review-item">
       <p>
      Bathroom Name:{" "}
      <Link className="bathroom-link" to={`/bathrooms/${review.BathroomId}`}>
        {getBathroomNameById(review.BathroomId)}
      </Link>
    </p>
          <p>Rating: {review.rating} stars</p>
          <p>Review Content: {review.content}</p>
          {/* <p>Review wheelchair: {review.wheelchair}</p> */}
          {/* <p>Bathroom ID: {review.BathroomId}</p> */}

          <p>Date Created: {review.createdAt}</p>
          {/* Render other review details here */}
          <hr />
        </div>
      ))}
    </div>
    </div>
    </div>
  );
}
