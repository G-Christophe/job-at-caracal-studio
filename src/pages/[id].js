import { Heading, Box, Text, HStack, Badge } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';

import supabase from '_supabase';
import Col from '_comps/Layout/Col';
import Container from '_comps/Layout/Container';
import RegistrationForm from '_comps/RegistrationForm'
import { getRegistrationById, getAllCountries } from '_lib/query';

export default function Single({ registration, countries }) {
	const router = useRouter();

	// Format departure date before passing the data as default form values
	registration.departure_date = dayjs(registration.departure_date).format("YYYY-MM-DDTHH:mm");

	const { register, handleSubmit, formState: { errors, isSubmitting, isDirty }, control } = useForm({defaultValues: registration});

	const onSubmit = async (data) => {
		try {
			const { error } = await supabase.from('registrations').update(data).match({id: data.id});
			if (error) throw error;
		} catch ( error ) {
			alert(error.error_description || error.message)
		} finally {
			router.back();
		}
	}

	return (
		<Box pt={6}>
			<Container>
				<Col colStart={2} colEnd={28}>
					<RegistrationForm registration={registration} countries={countries} onSubmit={onSubmit} />
				</Col>
			</Container>
		</Box>
	);
}


export async function getServerSideProps(context) {

	let { countries } = await getAllCountries();
	let { registration } = await getRegistrationById(context.params.id);
	
	return {
		props: {
			registration,
			countries
		},
	};
}
