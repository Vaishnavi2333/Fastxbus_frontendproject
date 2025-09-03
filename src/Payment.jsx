import { useNavigate } from "react-router-dom"

export function Payment(){

     const navigate = useNavigate();

    return(
        <>
        <p>Show total cost for bus travel including bus amenities,food and gst</p>
        <p>Show payment options and select-Card,UPI,NetBanking</p>
        <p>Confirm payment</p>
        
        </>
    )
}