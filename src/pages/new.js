import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';
import dayjs from 'dayjs';

import supabase from '_supabase';
import Col from '_comps/Layout/Col';
import Container from '_comps/Layout/Container';
import RegistrationForm from '_comps/RegistrationForm'
import { getAllCountries } from '_lib/query';

export default function AddNew({ countries }) {

	const router = useRouter();
	const registration = {};
	registration.departure_date = dayjs(new Date()).format("YYYY-MM-DDTHH:mm");

	const onSubmit = async (data) => {
		try {
			const { error } = await supabase.from('registrations').insert(data);
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

export async function getServerSideProps() {

	let { countries, countriesError } = await getAllCountries();

	return {
		props: {
			countries
		},
	};
}
