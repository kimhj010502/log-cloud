import { BrowserRouter, Routes, Route } from "react-router-dom";
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


function Routing() {
    return (
        <div className="body">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<App />} />

                    <Route path='feed' element={<Feed />} />

                    <Route path='social' element={<Social />} />
                    <Route path='social-feed' element={<SocialFeed />} />

                    <Route path='search' element={<Search />} />
                    <Route path='search-result' element={<SearchResult />} />

                    <Route path='analysis' element={<Analysis />} />

                    <Route path='profile' element={<Profile />} />
                    <Route path='manage-friends' element={<ManageFriends />} />
                    <Route path='change-password' element={<ChangePassword />} />

                    <Route path='login' element={<Login />} />
                    <Route path='signup' element={<Signup />} />

                    <Route path='record' element={<Record />} />
                    <Route path='upload' element={<Upload />} />
                    <Route path='save' element={<Save />} />
                    <Route path='edit' element={<Edit />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Routing