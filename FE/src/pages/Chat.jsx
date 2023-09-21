import React, { useContext, useEffect, useState } from "react";
import { CometChatUI } from '../cometchat-chat-uikit-react-3/CometChatWorkspace/src';
import Navbar from '../components/common/Navbar'
import { ProfileContext } from "../context/ProfileContext";
import "../styles/comet.css"
import $ from 'jquery';
import { HomeContext } from "../context/HomeContext";

export default function Chat() {
  const { profileId } = useContext(HomeContext)

  return (
    <>
      <Navbar></Navbar>
      {profileId ? (
        <CometChatUI chatWithUser={profileId.toString()} />
      ) : (
        <CometChatUI />
      )}
    </>
  );
}