const UniversityStorage=require("./UniversityStorage");

class University{
    constructor(body){
        this.body=body;
    }
    //테스트용
    async showUniversityNameList(university_id){
        console.log("University.js의 showUniversityNameList\n");
        try{
            const response=await UniversityStorage.getUniversityName();
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }

    // async getUnversityIdToName(university_id){
    //     try{
    //         const response=await UniversityStorage.getUnversityName(university_id);
    //         return response;
    //     }catch(err){
    //         return{success:false,msg:err};
    //     }
    // }
    // async getUnversityIdToUrl(university_id){
    //     try{
    //         const response=await UniversityStorage.getUnversityUrl(university_id);
    //         return response;
    //     }catch(err){
    //         return{success:false,msg:err};
    //     }
    // }
    // async showUniversityNameList(){
    //     try{
    //         const response=await UniversityStorage.getUniversityNameList();
    //         return response;
    //     }catch(err){
    //         return{success:false,msg:err};
    //     }
    // }
}

module.exports=University
