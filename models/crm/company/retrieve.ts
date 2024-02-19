import { Crm }  from '@run-morph/models';
import { Retrieve, Resource, Metadata, Error }  from '@run-morph/sdk';

// Define metadata for the HubSpot company model
const metadata:Metadata<Crm.Company> = {
	model: Crm.Company,
	scopes: ['crm.objects.company.read']
};

// Export a new List operation
export default new Retrieve( async (runtime, { id }) => { 
	console.log(id)
	// Call the HubSpot GET companies API
	const response = await runtime.proxy({
		method: 'GET',
		path: `/crm/v3/objects/companies/${id}`
	});

	
	console.log(response)
	// Handle errors from the API response
	if(response.status === 'error'){
        switch (response.category){
            default:
                throw new Error(Error.Type.UNKNOWN_ERROR, response.message);
        }
    }

	// Map resource for the response
	const resource = mapResource(response) 

	// Return the resources and the next cursor for pagination
	return resource

}, metadata );


// Helper function to map HubSpot contacts to HubSpot company resource
function mapResource(hs_company){
	return new Resource({ 
		id: hs_company.id,
		data: {
			name: hs_company.properties.name
		},
			created_at: new Date(hs_company.createdAt).toISOString(),
			updated_at: new Date(hs_company.updatedAt).toISOString()
		}, Crm.Company)
}