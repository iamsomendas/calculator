package com.example.calculator.controller;

import com.example.calculator.dto.CalculatorRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calculate")
@CrossOrigin(origins = "*")
public class CalculatorController {

    @PostMapping
    public ResponseEntity<?> calculate(@RequestBody CalculatorRequest request) {
        double result;

        switch (request.getOperator()) {
            case "add" -> result = request.getNum1() + request.getNum2();
            case "subtract" -> result = request.getNum1() - request.getNum2();
            case "multiply" -> result = request.getNum1() * request.getNum2();
            case "divide" -> {
                if(request.getNum2() == 0){
                    return ResponseEntity.badRequest().body("Cannot divide by zero");
                }
                result = request.getNum1() / request.getNum2();
            }
            default -> {
                return ResponseEntity.badRequest().body("Invalid operator");
            }
        }
        return ResponseEntity.ok(new CalculationResponse(result));
    }
    record CalculationResponse(double result){};
}
