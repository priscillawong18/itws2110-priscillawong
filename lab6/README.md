In this lab, I created a basic calculator using PHP. It was a good reminder or refresher on how to use PHP since I haven't used it since Introduction to ITWS last fall. I was able to create the subclasses for subtraction, multiplication, and division the same way addition was implemented for us. Additionally, I was able to instantiate a new object for each button corresponding to the operation and operands. I used online resources to learn more about the PHP isset() function.

References:
https://www.w3schools.com/php/func_var_isset.asp

Questions:

1) Explain what each of your classes and methods does, the order in which methods are invoked, and the flow of execution after one of the operation buttons has been clicked.

The abstract Operation class defines the structure for all operations. It stores two operands and requires subclasses to implement operate() and getEquation(). The subclasses (Addition, Subtraction, Multiplication, and Division) defies how to perform the calculation and how to format the equation. When a user clicks on the respective button, the form sends a request. This creates an instance of the class and calls getEquation() which calls operate() to compute and display the result.

2) Also explain how the application would differ if you were to use $_GET, and why this may or may not be preferable.

If $_GET were used instead of $_POST, the input values and button would be in the URL as query parameters. THis would make the results sharable, making it less secure since sensitive data would be exposed. Using $_POST is preferable because it keeps user input hidden is better for form submissions. 

3) Finally, please explain whether or not there might be another (better +/-) way to determine which button has been pressed and take the appropriate action

The current code uses if statements to determine which button was pressed. Another way to do this is to use an associative array that maps button names to their class names. Then, loop through the array to check which button was pressed and dynamically instantiate the matching class with the variable class names.