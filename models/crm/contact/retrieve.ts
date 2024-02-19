import { Crm }  from '@run-morph/models';
import { Retrieve, Resource, Metadata, Error }  from '@run-morph/sdk';

// Define metadata for the HubSpot contact model
const metadata:Metadata<Crm.Contact> = {
	model: Crm.Contact,
	scopes: ['crm.objects.contacts.read']
};


export default new Retrieve( async (runtime, { id }) => { 

	// Call the HubSpot GET contact API
	const response = await runtime.proxy({
		method: 'GET',
		path: `/crm/v3/objects/contacts/${id}`
	});

	
	console.log(response)
	// Handle errors from the API response
	if(response.status === 'error'){
        switch (response.category){
            default:
                throw new Error(Error.Type.UNKNOWN_ERROR, response.message);
        }
    }

	const resource = mapResource(response) 
	
	return resource

}, metadata );


// Helper function to map HubSpot contacts to HubSpot Contact resources
function mapResource(hs_contact){
	return new Resource({ 
		id: hs_contact.id,
		data: {
			first_name: hs_contact.properties.firstname,
			last_name: hs_contact.properties.lastname,
			email: hs_contact.properties.email,
			phone: hs_contact.properties.phone
		},
			created_at: new Date(hs_contact.createdAt).toISOString(),
			updated_at: new Date(hs_contact.updatedAt).toISOString()
		}, Crm.Contact)
}