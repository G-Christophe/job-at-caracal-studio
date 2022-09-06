import { Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Checkbox, Input, Collapse, Spinner, Center, HStack, Button, useDisclosure, Box, ButtonGroup, Badge, Image} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { debounce, filter as _filter, trim } from 'lodash';

import { registrationColumns as columns, ticketTypeOptions, statusOptions, specialTypeOptions } from '_lib/const';
import Col from '_comps/Layout/Col';
import Container from '_comps/Layout/Container';
import MotionBox from '_comps/MotionBox';
import ConfirmDialog from '_comps/AlertDialog/ConfirmDialog';
import SelectField from '_comps/SelectField';
import supabase  from '_supabase';
import dayjs from 'dayjs';

export default function Dashboard() {
	const router = useRouter();
	const [ selectedRows, setSelectedRows ] = useState([]);
	const [ filters, setFilters ] = useState({});
	const [ pageIndex, setPageIndex ] = useState(1);
	const [ pagesTotal, setPageTotal ] = useState(0);
	const [ isLoading, setLoading ] = useState(true);
	const [ data, setData ] = useState();
	const [ isFiltersOpen, setFiltersOpen ] = useState(true);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const getRegistrations = async () => {

		const size = 3;
		const from =  (pageIndex - 1) * size;
		const to = from + size - 1;

		try {
			setLoading(true)
			let { data, count, error } = await supabase
			.from("registrations")
			.select("*", { count: "exact" })
			.order("id", { ascending: true })
			.match(filters)
			.range(from, to);

			if (error) {
				throw error;
			}

			if (data) {
				setData(data);
				setPageTotal(Math.ceil(count / size))
			}
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(()=> { getRegistrations() }, [pageIndex, filters]);


	// Batch delete

	// TODO: Set the select state on data 
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

	// TODO: On delete confirmation delete the selected items from data instead of a hard reload
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
	
	const setFilterUI = (column) => {
		switch(column.keyname) {
			case 'ticket_type': 
				return <SelectField name={column.keyname} options={ticketTypeOptions}  onChange={handleFiltering} data-key={column.keyname} width="100px"  bg="white"/>
			case 'status':
				return <SelectField name={column.keyname} options={statusOptions}  onChange={handleFiltering} data-key={column.keyname} width="100px"  bg="white"/>
			case 'special_type':
				return <SelectField name={column.keyname} options={specialTypeOptions}  onChange={handleFiltering} data-key={column.keyname} width="100px"  bg="white"/>
			case 'id':
				return <Input type="number" onChange={handleFiltering} data-key={column.keyname} bg="white" />
			default:
				return <Input onChange={handleFiltering} data-key={column.keyname}  bg="white" />
		}
	}

	const toggleFilters = (e) => {
		setFiltersOpen(!isFiltersOpen);
	}

	const setFilter = (keyname, value) => {
		const newValue = trim(value);
		if (newValue.length > 0) {
			setFilters({...filters, [keyname]: newValue});
		} else {
			setFilters(_filter(filters, value => value != newValue))
		}
	}

	const debounceFiltering = useCallback(debounce(setFilter, 500), []);

	const handleFiltering = (e) => {
		debounceFiltering(e.target.dataset.key, e.target.value);
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

	const closeIconVariants = {
		open: {rotate: '315deg'},
		close: {rotate: 0}
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
						<Button variant="ternary" onClick={toggleFilters}>
							<MotionBox transition="0.5s ease-in-out" animate={isFiltersOpen? "close" : "open"} variants={closeIconVariants}>
								<Image src="close-icon.svg" alt="Close" width="10px" />
							</MotionBox>
							<Text ml={2}>Filters</Text>
						</Button>
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
								{columns.map((column, i) => 
									<Td colSpan={(i==0)? 2 : 1} key={column.keyname} py={0}>
										<Collapse in={isFiltersOpen} animateOpacity><Box py={4}>{setFilterUI(column)}</Box></Collapse>
									</Td> 
								)}
							</Tr> 
							{isLoading && <Tr><Td colSpan={columns.length + 1}><Center><Spinner /></Center></Td></Tr>}
							{data && data.length == 0 && <Tr><Td colSpan={columns.length + 1} bg="orange.200"><Text fontSize="md">No results</Text></Td></Tr>}
							{data && data.map((row) => {
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
				<HStack w="full" justifyContent="space-between" py={3} px={6}>
					<ButtonGroup>
						<Button onClick={()=> setPageIndex(pageIndex-1)} isDisabled={pageIndex <= 1} variant="secondary">Previous</Button>
						<Button onClick={()=> setPageIndex(pageIndex+1)} isDisabled={pageIndex >= pagesTotal} variant="secondary">Next</Button>
					</ButtonGroup>
					{data && <Text alignItems="flex-start">Page {pageIndex} of {pagesTotal}</Text>}
				</HStack>

					
				<ConfirmDialog onClose={onClose} onConfirm={onConfirmDelete} isOpen={isOpen}/>

			</Col>
		</Container>
		</Box>
	);
}

export async function getServerSideProps() {

	return {
		props: {}
	};
}
