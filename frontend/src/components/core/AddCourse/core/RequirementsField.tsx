import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";

interface RequirementsFieldProps {
  name: string;
  label: string;
  register: (name: string, options: object) => void;
  setValue: (name: string, value: any) => void;
  errors: { [key: string]: { message: string } };
}

const RequirementsField: React.FC<RequirementsFieldProps> = ({
  name,
  label,
  register,
  setValue,
  errors,
}) => {
  //@ts-ignore
  const { editCourse, course } = useSelector((state) => state.course);
  const [requirement, setRequirement] = useState<string>("");
  const [requirementsList, setRequirementsList] = useState<string[]>([]);

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions || []);
    }
    register(name, {
      required: true,
      validate: (value: string[]) => value.length > 0,
    });
  }, [editCourse, course?.instructions, name, register]);

  useEffect(() => {
    setValue(name, requirementsList);
  }, [requirementsList, setValue, name]);

  const handleAddRequirement = () => {
    if (requirement && !requirementsList.includes(requirement)) {
      setRequirementsList([...requirementsList, requirement]);
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = [...requirementsList];
    updatedRequirements.splice(index, 1);
    setRequirementsList(updatedRequirements);
  };

  return (
    <div className="flex flex-col space-y-2">
      <Card className="w-full">
        <CardBody>
          <label className="text-sm text-gray-700" htmlFor={name}>
            {label} <sup className="text-pink-500">*</sup>
          </label>
        </CardBody>
        <Divider />
        <CardBody>
          <div className="flex flex-col items-start space-y-2">
            <Input
              type="text"
              id={name}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Enter Instructions for students"
              className="w-full"
            />

            <Button
              onClick={handleAddRequirement}
              color="warning"
              variant="bordered"
            >
              Add
            </Button>
          </div>
        </CardBody>
        <Divider />
        <CardBody>
          {requirementsList.length > 0 && (
            <ul className="mt-2 list-inside list-disc">
              {requirementsList.map((req, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span>{req}</span>
                  <button
                    type="button"
                    className="ml-2 text-xs text-gray-400"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    <RiDeleteBin6Line className="text-pink-500 text-sm hover:scale-125 duration-200" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {errors[name] && (
            <span className="ml-2 text-xs tracking-wide text-pink-500">
              {label} is required
            </span>
          )}
        </CardBody>
        <Divider />
      </Card>
    </div>
  );
};

export default RequirementsField;
