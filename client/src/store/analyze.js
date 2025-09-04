import { create } from "zustand";

    // const [userid, setUserid] = useState(null)
    // const [isMatched, setIsMatched] = useState(false)
    // const [AnalysedMatch, setAnalysedMatch] = useState([])
    // const  [refresh,setRefresh] = useState(true)



const AnalyzedTableStore = create((set)=>({

 userid:null,
 isMatched:false,
 AnalysedMatch:[],
 refresh:true,
 
 setUserid:(data)=>set({userid:data}),
 setIsMatched:(data)=>set({isMatched:data}),
 setAnalysedMatch:(data)=>set({AnalysedMatch:data}),
 setRefresh:(data)=>set({refresh:data})

}))

export default AnalyzedTableStore