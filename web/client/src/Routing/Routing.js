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
    }, []);

    const updateIsAuthorized = (value) => {
        setIsAuthorized(value);
    };

    return (
        <div className="body">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={isAuthorized ? <App /> : <Navigate to="/login" replace />} />

                    <Route path='feed' element={isAuthorized ? <Feed /> : <Navigate to="/login" replace />} />

                    <Route path='social' element={isAuthorized ? <Social /> : <Navigate to="/login" replace />} />
                    <Route path='social-feed' element={isAuthorized ? <SocialFeed /> : <Navigate to="/login" replace />} />

                    <Route path='search' element={isAuthorized ? <Search /> : <Navigate to="/login" replace />} />
                    <Route path='search-result' element={isAuthorized ? <SearchResult /> : <Navigate to="/login" replace />} />

                    <Route path='analysis' element={isAuthorized ? <Analysis /> : <Navigate to="/login" replace />} />

                    <Route path='profile' element={isAuthorized ? <Profile updateIsAuthorized={updateIsAuthorized} /> : <Navigate to="/login" replace />} />
                    <Route path='manage-friends' element={isAuthorized ? <ManageFriends /> : <Navigate to="/login" replace />} />
                    <Route path='change-password' element={isAuthorized ? <ChangePassword /> : <Navigate to="/login" replace />} />

                    <Route path='login' element={isAuthorized ? <Navigate to="/" replace /> : <Login updateIsAuthorized={updateIsAuthorized} /> } />
                    <Route path='signup' element={isAuthorized ? <Navigate to="/" replace /> : <Signup /> } />

                    <Route path='record' element={isAuthorized ? <Record /> : <Navigate to="/login" replace />} />
                    <Route path='upload' element={isAuthorized ? <Upload /> : <Navigate to="/login" replace />} />
                    <Route path='save' element={isAuthorized ? <Save /> : <Navigate to="/login" replace />} />
                    <Route path='edit' element={isAuthorized ? <Edit /> : <Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Routing