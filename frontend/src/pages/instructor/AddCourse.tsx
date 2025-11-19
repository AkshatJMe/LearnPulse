import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import RenderSteps from "../../components/core/AddCourse/RenderSteps";

const AddCourse = () => {
  return (
    <div className="flex w-full items-start gap-x-8 p-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium font-boogaloo text-center lg:text-left">
          Create a New Course
        </h1>

        <div className="flex-1">
          <RenderSteps />
        </div>
      </div>

      <Card className="sticky top-10 hidden lg:block max-w-[400px] flex-1 border-[1px] rounded-3xl border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4 ">
        <CardHeader>
          <div className="flex flex-col">
            <p className="mb-8 text-lg">
              💡 Tips for Publishing Your Course
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="ml-5 list-item list-disc space-y-4 text-gray-700 dark:text-gray-200">
          <li>Choose a pricing option or make your course free.</li>
          <li>Use a 1024×576 image for the course thumbnail.</li>
          <li>Add an overview video in the video section.</li>
          <li>Use the Course Builder to add and organize content.</li>
          <li>Create lessons, quizzes, and assignments under each topic.</li>
          <li>
            The “Additional Info” section appears on the course details page.
          </li>
          <li>Post announcements to update all enrolled students.</li>
          <li>Use course notes to share key resources or instructions.</li>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddCourse;
