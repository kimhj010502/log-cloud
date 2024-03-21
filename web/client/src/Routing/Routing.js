import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './Routing.css'

import App from '../AppPage/App'

import Feed from '../MyFeedPage/MyFeed'

import Social from '../SocialPage/Social'
import SocialFeed from '../SocialFeedPage/SocialFeed'

import Search from '../SearchPage/Search'
import SearchResult from '../SearchResultPage/SearchResult'

import Analysis from "../AnalysisPage/Analysis";

import Profile from '../ProfilePage/Profile'
import ManageFriends from '../ManageFriendsPage/ManageFriends'
import ChangePassword from '../ChangePasswordPage/ChangePassword'

import Login from '../LoginPage/Login'
import Signup from '../SignupPage/Signup'

import Record from '../RecordPage/Record'
import Upload from '../UploadPage/Upload'
import Save from '../SavePage/Save'
import Edit from '../EditPage/Edit'
import {useEffect, useState} from "react";

function Routing() {
    const [isAuthorized, setIsAuthorized] = useState(false);

    // authorization check
    useEffect(() => {
        console.log('username', sessionStorage.getItem('username'))
        // add authorization
        async function checkAuthentication() {
            try {
                const response = await fetch('/authentication');
                const data = await response.json();
                setIsAuthorized(data.authenticated);
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthorized(false);
            }
        }
        checkAuthentication();
    }, [sessionStorage.getItem('username')]);

    // const updateIsAuthorized = (value) => {
    //     setIsAuthorized(value);
    // };

    return (
        <div className="body">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={sessionStorage.getItem('username')  ? <App /> : <Navigate to="/login" replace />} />

                    <Route path='feed' element={sessionStorage.getItem('username')  ? <Feed /> : <Navigate to="/login" replace />} />

                    <Route path='social' element={sessionStorage.getItem('username') ? <Social /> : <Navigate to="/login" replace />} />
                    <Route path='social-feed' element={sessionStorage.getItem('username') ? <SocialFeed /> : <Navigate to="/login" replace />} />

                    <Route path='search' element={sessionStorage.getItem('username') ? <Search /> : <Navigate to="/login" replace />} />
                    <Route path='search-result' element={sessionStorage.getItem('username') ? <SearchResult /> : <Navigate to="/login" replace />} />

                    <Route path='analysis' element={sessionStorage.getItem('username') ? <Analysis /> : <Navigate to="/login" replace />} />

                    <Route path='profile' element={sessionStorage.getItem('username') ? <Profile /> : <Navigate to="/login" replace />} />
                    <Route path='manage-friends' element={sessionStorage.getItem('username') ? <ManageFriends /> : <Navigate to="/login" replace />} />
                    <Route path='change-password' element={sessionStorage.getItem('username') ? <ChangePassword /> : <Navigate to="/login" replace />} />

                    <Route path='login' element={sessionStorage.getItem('username') ? <Navigate to="/" replace /> : <Login /> } />
                    <Route path='signup' element={sessionStorage.getItem('username') ? <Navigate to="/" replace /> : <Signup /> } />

                    <Route path='record' element={sessionStorage.getItem('username') ? <Record /> : <Navigate to="/login" replace />} />
                    <Route path='upload' element={sessionStorage.getItem('username') ? <Upload /> : <Navigate to="/login" replace />} />
                    <Route path='save' element={sessionStorage.getItem('username') ? <Save /> : <Navigate to="/login" replace />} />
                    <Route path='edit' element={sessionStorage.getItem('username') ? <Edit /> : <Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Routing