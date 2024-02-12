import { Crm }  from "@run-morph/models";
import { Create, Resource, Metadata, Error, ErrorType }  from "@run-morph/sdk";

const metadata:Metadata<Crm.Contact> = {
    model: Crm.Contact,
	scopes:[
        'crm.objects.contacts.write',
        'crm.schemas.contacts.write'
    ]
};

export default new Create(async (runtime, { data }) => { 
	
    const response = await runtime.proxy({
        method: 'POST',
        path: '/crm/v3/objects/contacts',
        body:{
            properties: {
                email: data.email,
                firstname: data.first_name,
                lastname: data.last_name,
                phone: data.phone
            }
        }
    });
    
    if(response.status === 'error'){
        switch (response.category){
            case 'CONFLICT':
                return new Error(ErrorType.RESOURCE_ALREADY_EXIST, response.message);
            default:
                return new Error(ErrorType.UNKNOWN_ERROR, response.message);
        }
    }
    
    if(response.id){
        const resource = new Resource<Crm.Contact>({ 
            id: response.id,
            created_at: new Date(response.createdAt).toISOString(),
            updated_at: new Date(response.updatedAt).toISOString()
        }, metadata.model)  
       
        return resource;
    } else {
        return new Error(ErrorType.UNKNOWN_ERROR);
    }

}, metadata);