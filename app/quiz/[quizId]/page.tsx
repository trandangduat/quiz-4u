export default async function Page({ 
    params 
} : { 
    params: Promise<{ quizId: string }> 
}) {
    const { quizId } = await params;
    return (
        <>
            <h1>Test page {quizId}</h1>
        </>
    );
}