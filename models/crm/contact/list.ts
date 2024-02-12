import { Crm }  from "@run-morph/models";
import { List, Resource, Metadata, Error, ErrorType }  from "@run-morph/sdk";

const metadata:Metadata<Crm.Contact> = {
	model: Crm.Contact,
	scopes: ['crm.objects.contacts.read']
};

export default new List( async (runtime, { filters }) => { 
	
	const response = await runtime.proxy({
        method: 'GET',
        path: '/crm/v3/objects/contacts'
    });

	const resources: Resource<Crm.Contact>[] = response.results.map((hs_contact) => (new Resource<Crm.Contact>({ 
		id: hs_contact.id,
		data: {
			first_name: hs_contact.properties.firstname,
			last_name: hs_contact.properties.lastname,
			email: hs_contact.properties.email,
			phone: hs_contact.properties.phone
		},
		created_at: new Date(hs_contact.createdAt).toISOString(),
		updated_at: new Date(hs_contact.updatedAt).toISOString()
	}, metadata.model)));  

	return { resources };

}, metadata);