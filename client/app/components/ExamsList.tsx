export const ExamsList = (props: { children: JSX.Element }) => {
    return (
        <div className="m-auto grid mt-8 gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-8 justify-center items-center">
            {props.children}
        </div>
    );
}
