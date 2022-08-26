import { Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Checkbox, Input, Select, HStack, Button, useDisclosure, Box, ButtonGroup, Badge, Image} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { registrationColumns as columns } from '_lib/const';
import Col from '_comps/Layout/Col';
import Container from '_comps/Layout/Container';
import ConfirmDialog from '_comps/AlertDialog/ConfirmDialog';

import supabase  from '_supabase';
import dayjs from 'dayjs';

export default function Dashboard({ data, count, page, pagesTotal}) {
	const router = useRouter();
	const [ selectedRows, setSelectedRows ] = useState([]);
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Batch delete

	const handleSelectedRow = (e) => {
		const { value, checked } = e.target;
		if (checked) {
			setSelectedRows([...selectedRows, value]);
		} else { 
			setSelectedRows(selectedRows.filter((item) => item != value));
		}
	}

	const handleSelectedAllRows = (e) => {

	}

	const handleDeleteRows = async (e) => { 
		onOpen();
	}

	const onConfirmDelete = async (e) => {
		onClose();
		await deleteRows();
		router.reload();
	}

	const deleteRows = async (e) => { 
		try {
			const { error } = await supabase
			.from('registrations')
			.delete()
			.in('id', selectedRows);
		} catch (error) {
			console.log(error.message)
		}
	}

	// Filters

	const toggleFilters = (e) => {

	}

	// Format Cell

	const formatCell = (column, data) => {
		switch (column.keyname) {
			case 'departure_date': 
				return dayjs(data).format('DD/MM/YY');
			case 'flight_cost':
				return '€ ' + data;
			case 'status':
				// TODO: Set badge color based on status
				return <Badge>{data}</Badge>
			case 'country':
				// TODO: Return flag based on country
				return <Image src="/flag.png" alt="Belgium" boxSize='20px' />;
			default: 
				return data;
		}
	}

	// Styles 
	// TODO: handle style in theme when possible

	const hoverRowStyle = {
		cursor: 'pointer',
		backgroundColor: 'gray.100'
	}
	
	const thStyle = {
		textTransform: 'none',
		color: "#667085",
		backgroundColor: 'gray.50'
	}


	return (
		<Box pt={6}>
		<Container>
			<Col colStart={1} colEnd={29}>
				<HStack w="full" justifyContent="space-between" py={3} px={6}>
					<ButtonGroup>
						<Button onClick={()=>{router.push('/new')}}>Add registration</Button>
						{ selectedRows.length > 0 && <Button onClick={handleDeleteRows}>Delete</Button> }
					</ButtonGroup>
					<ButtonGroup>
						<Button variant="ternary" onClick={toggleFilters}>Filters</Button>
					</ButtonGroup>
				</HStack>
			</Col>
			<Col colStart={1} colEnd={28}>
				<TableContainer>
					<Table size="md">
						<Thead>
							<Tr bg="#FCFCFD">
								<Td><Checkbox onChange={handleSelectedAllRows}/></Td>
								{columns.map((column) => <Th style={thStyle} key={column.keyname}>{column.header}</Th>)}
							</Tr>
						</Thead>
						<Tbody>
							<Tr bg="gray.50">
								<Td colSpan={2}><Input /></Td>
								<Td><Input /></Td>
								<Td><Input /></Td>
								<Td><Input /></Td>
								<Td><Input /></Td>
								<Td><Select size="md" id="status" name="status" placeholder='Status' width="100px">
                                    <option key="status1" value='Initialized'>Initialized</option>
                                    <option key="status2" value='Created'>Created</option>
                                    <option key="status3" value='Verified'>Verified</option>
                                    <option key="status4" value='Completed'>Completed</option>
                                    <option key="status5" value='Declined'>Declined</option>
                                </Select></Td>
								<Td><Input /></Td>
								<Td><Select id="ticket_type" name="ticket_type" placeholder='Ticket' width="100px">
                                    <option key="status1" value='FIX'>FIX</option>
                                    <option key="status2" value='FLEX'>FLEX</option>
                                </Select></Td>
								<Td><Input /></Td>
								<Td><Input /></Td>
								<Td><Input /></Td>
							</Tr>
							{data.map((row) => {
								return (
								<Tr role="group" key={row.id}>
									<Td _groupHover={hoverRowStyle}><Checkbox value={row.id} onChange={handleSelectedRow}/></Td>
									{columns.map((column) => 
										{
											const content = formatCell(column, row[column.keyname]);
											return (<Td key={`${row.id}-${column.keyname}`} _groupHover={hoverRowStyle} onClick={()=>router.push(`/${row.id}`)}>{content}</Td>);
										}
									)}
								</Tr>
								)}
							)}
						</Tbody>
					</Table>
				</TableContainer>
				<HStack w="full" justifyContent="space-between" py={3}>
					<ButtonGroup>
						<Button onClick={()=> router.push(`?page=${page-1}`)} isDisabled={page <= 1} variant="secondary">Previous</Button>
						<Button onClick={()=> router.push(`?page=${page+1}`)} isDisabled={page >= pagesTotal} variant="secondary">Next</Button>
					</ButtonGroup>
					<Text alignItems="flex-start">Page {page} of {pagesTotal}</Text>
				</HStack>

					
				<ConfirmDialog onClose={onClose} onConfirm={onConfirmDelete} isOpen={isOpen}/>

			</Col>
		</Container>
		</Box>
	);
}

export async function getServerSideProps({ query: { page = 1} }) {

	const size = 3;
	const from =  (page - 1) * size;
	const to = from + size - 1;

	let { data, count, error } = await supabase
	.from("registrations")
	.select("*", { count: "exact" })
	.order("id", { ascending: true })
	.range(from, to);

	if (error) throw error;

	const pagesTotal = Math.ceil(count / size);

	return {
		props: {
			data,
			count,
			page: +page,
			pagesTotal
		},
	};
}
