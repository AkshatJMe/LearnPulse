import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllStudentsData } from "../../services/operations/adminAPI";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";

const AllStudents = () => {
  //@ts-ignore
  const { token } = useSelector((state) => state.auth);
  const [allStudents, setAllStudents] = useState([]);

  const columns = [
    {
      key: "firstName",
      label: "FIRST NAME",
    },
    {
      key: "lastName",
      label: "LAST NAME",
    },
    {
      key: "email",
      label: "Email",
    },
  ];

  useEffect(() => {
    const fetchAllStudents = async () => {
      //@ts-ignore
      const { allStudentsDetails, studentsCount } = await getAllStudentsData(
        token
      );
      setAllStudents(allStudentsDetails);
    };

    fetchAllStudents();
  }, [token]);
  return (
    <div className="p-10">
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={allStudents}>
          {(item) => (
            //@ts-ignore
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllStudents;
