import supabase from '_supabase';

export const getRegistrationById = async(id) => {
    let { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("id", id );

    if (error) throw error;

    return { registration: data[0], countriesError: error }
}

export const getAllCountries = async() => {
	let { data, error } = await supabase
	.from("countries")
	.select("*")
	.order("label", {ascending: true});

	if (error) throw error;

	return { countries: data, countriesError: error }
}

