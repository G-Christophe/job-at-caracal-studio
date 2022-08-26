import { forwardRef, Text, FormControl, Input, NumberInput, NumberInputField, Select, FormLabel, FormErrorMessage, Button, Stack, HStack, Heading, Badge, Box, Image } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';

import Col from '_comps/Layout/Col';
import Container from '_comps/Layout/Container';
import { ticketTypeOptions } from '_lib/const';


const FormControlText = ({ label, keyName, placeholder, register, errors, registerOptionsObj = {} }) => (
    <FormControl isRequired={registerOptionsObj.required} isInvalid={errors[keyName]}>
        <FormLabel htmlFor={keyName}>{label}</FormLabel>
        <Input id={keyName} name={keyName} placeholder={placeholder} {...register(keyName, registerOptionsObj)} />
        <FormErrorMessage>{errors[keyName] && errors[keyName].message}</FormErrorMessage>
    </FormControl>
);


const RegistrationForm = forwardRef(({ registration = {}, countries = [], onSubmit }, ref ) => {

   // const { registration , countries, onSubmit } = props;

    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty }, control } = useForm({defaultValues: registration});


    return(  
        <form onSubmit={handleSubmit(onSubmit)} ref={ref} >
            <Container gap={4}>
                <Col colStart={1} colEnd={19}>
                    <Box mb={8} mt={5}>
                        <Button variant="link" onClick={()=>{router.back()}}><Image src="/back-icon.svg" alt="Arrow back icon" mr={4} /> Back</Button>
                    </Box>
                    <Text color="gray.400">{registration.id}</Text>
                    <HStack mb={7}>
                        <Heading as="h1" size="xl" mr={2}>{ registration.first_name ? `${registration.first_name} ${registration.last_name}` : "New entry" }</Heading>
                        {registration.status && <Badge>{registration.status}</Badge>}
                    </HStack>
                    <Heading as="h2" size="md" pb={4} mb={4} borderBottom="1px solid" borderColor="gray.200">Identity details</Heading>

                    <Container gap={8} templateColumns="repeat(2, 1fr)">
                        <Col colStart={1} colEnd={[1,2]}>
                            <FormControlText 
                            label="Email" keyName="email" placeholder="example@email.com" register={register} errors={errors} registerOptionsObj={{required: 'Email is required'}} />
                        </Col>
                        <Col colStart={2} colEnd={2}>
                            <FormControlText 
                                label="Travel code" keyName="travel_code" placeholder="" register={register} errors={errors} />
                        </Col>
                        <Col colStart={1} colEnd={[1,2]}>
                            <FormControlText 
                                label="First name" keyName="first_name" placeholder="First Name" register={register} errors={errors} registerOptionsObj={{required: 'First name is required'}} />
                        </Col>
                        <Col colStart={2} colEnd={[1,2]}>
                            <FormControlText 
                            label="Last name" keyName="last_name" placeholder="Last Name" register={register} errors={errors} registerOptionsObj={{required: 'Last name is required'}} />
                        </Col>
                        <Col colStart={1} colEnd={2}>
                            <FormControl isInvalid={errors.departure_date}>
                                <FormLabel htmlFor="deparature_date">Departure date</FormLabel>
                                <Input 
                                id="deparature_date" 
                                name="deparature_date" 
                                type="datetime-local" 
                                placeholder="Select a date" 
                                {...register('departure_date', { valueAsDate: true })} />
                            </FormControl>
                        </Col>
                        <Col colStart={2} colEnd={2}>
                            <FormControl>
                                <FormLabel htmlFor="flight_cost">Flight cost</FormLabel>
                                <Controller
                                    name="flight_cost"
                                    control={control}
                                    // rules={{ required: 'Flight cost is required' }}
                                    render={({ field }) => (
                                    <NumberInput id="flight_cost" {...field}>
                                        <NumberInputField />
                                    </NumberInput>
                                    )}
                                />
                            </FormControl>
                        </Col>
                        <Col colStart={1} colEnd={2}>
                            <FormControl isRequired isInvalid={errors.country}>
                                <FormLabel htmlFor="country">Country</FormLabel>
                                <Select id="country" name="country" placeholder='Select a country' {...register("country", {required: "Country is required"})}>
                                    {countries.map((country) => (<option key={country.iso} value={country.iso}>{country.label}</option>))}
                                </Select>
                                <FormErrorMessage>{errors.country && errors.country.message}</FormErrorMessage>
                            </FormControl>
                        </Col>
                    </Container>
                </Col>
                <Col colStart={20} colEnd={26}>
                    <Box px={8} py={5} borderRadius={8} bgColor="gray.50" minH="95vh">
                        <Stack gap={4}>
                            <Button type="submit" isLoading={isSubmitting}>Save</Button>

                            <FormControl>
                                <FormLabel htmlFor="status">Status</FormLabel>
                                <Select variant='filled' bg='white' id="status" name="status" placeholder='Select a status' { ...register('status') }>
                                    <option key="status1" value='Initialized'>Initialized</option>
                                    <option key="status2" value='Created'>Created</option>
                                    <option key="status3" value='Verified'>Verified</option>
                                    <option key="status4" value='Completed'>Completed</option>
                                    <option key="status5" value='Declined'>Declined</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor="ticket_type">Ticket type</FormLabel>
                                <Select variant='filled' bg='white' id="ticket_type" name="ticket_type" placeholder='Select a ticket type' { ...register('ticket_type') }>
                                    <option key="status1" value='FIX'>FIX</option>
                                    <option key="status2" value='FLEX'>FLEX</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor="special_type">Special type</FormLabel>
                                <Select variant='filled' bg='white' id="special_type" name="special_type" placeholder='Select a special type' { ...register('special_type') }>
                                    <option key="status1" value="stdn">Standard</option>
                                    <option key="status2" value="acc">Accessibility</option>
                                </Select>
                            </FormControl>
                        
                        </Stack>
                    </Box>
                </Col>
            </Container>	
        </form>
    )
});

export default RegistrationForm;