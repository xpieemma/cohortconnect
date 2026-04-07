import { useEffect, useState } from "react"
import { githubClient } from "../clients/api"
import { useUser } from "../context/UserContext"

function MemberCard({member}) {
    const {user} = useUser()
    const [following,setFollowing] = useState(false)

    useEffect(()=>{
        if(user._id){
            
            const getData = async () => {
                try {
                    // check if current loggedin user follows this user
                    const { data } = await githubClient.get(`/following/${member.githubUsername}`)
                    setFollowing(data.following)
                    console.log('response',data.following);
                    
                }
                catch(err) {
                    console.dir(err)
                    alert(err.response.data.message)
                }
            }
            getData()

        }
    },[user])

    
    const follow = async () => {
        try {
            // check if current loggedin user follows this user
            const { data } = await githubClient.put(`/follow/${member.githubUsername}`)
            setFollowing(data.following)
            console.log('response',data.following);
            
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
    }
    const unfollow = async () => {
        try {
            // check if current loggedin user follows this user
            const { data } = await githubClient.delete(`/unfollow/${member.githubUsername}`)
            setFollowing(data.following)
            console.log('response',data.following);
            
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
    }



    return (
        <li className="card">
            <div>{member.username}</div>
            <div>GitHub: <a href={`https://github.com/${member.githubUsername}`} target="_blank">{member.githubUsername}</a></div>
            <div>{following?<button onClick={unfollow}>Following</button>:<button onClick={follow}>Not Following</button>}</div>
        </li>
    )
}

export default MemberCard