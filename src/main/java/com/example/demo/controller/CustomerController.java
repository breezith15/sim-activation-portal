package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AddressUpdateRequest;
import com.example.demo.dto.CustomerValidationRequest;
import com.example.demo.dto.IdProofUpdateRequest;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Sim;
import com.example.demo.service.PortalService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/customer")
public class CustomerController {

    private final PortalService portalService;

    public CustomerController(PortalService portalService) {
        this.portalService = portalService;
    }

    @GetMapping("/")
    public String home() {
        return "SIM Activation Portal Running";
    }

    // ==========================
    // DASHBOARD API
    // ==========================
    @GetMapping("/dashboard")
    public Map<String, Long> dashboard() {

        Map<String, Long> dashboard = new HashMap<>();

        dashboard.put("totalCustomers", portalService.getCustomerCount());
        dashboard.put("totalSims", portalService.getSimCount());
        dashboard.put("activeSims", portalService.getActivatedSimCount());
        dashboard.put("inactiveSims", portalService.getInactiveSimCount());

        return dashboard;
    }

    // ==========================
    // CUSTOMER
    // ==========================

    @PostMapping("/add")
    public String addCustomer(@RequestBody Customer customer) {

        Customer savedCustomer = portalService.addCustomer(customer);

        return "Customer Saved Successfully.\n\nCustomer ID : "
                + savedCustomer.getId();
    }
    @GetMapping("/all")
    public List<Customer> getAllCustomers() {
        return portalService.getAllCustomers();
    }

    @PostMapping("/validate")
    public String validateCustomer(@RequestBody CustomerValidationRequest request) {

        portalService.validateCustomer(
                request.getEmail(),
                request.getDob());

        return "Customer Validated Successfully";
    }

    @PostMapping("/validateDetails")
    public String validateDetails(@RequestBody Customer customer) {

        portalService.validateCustomerDetails(
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail());

        return "Customer Details Valid";
    }

    @PutMapping("/updateAddress/{id}")
    public String updateAddress(@PathVariable Integer id,
                                @RequestBody AddressUpdateRequest request) {

        portalService.updateAddress(id, request.getAddress());

        return "Address Updated Successfully";
    }

    @PutMapping("/updateIdProof/{id}")
    public String updateIdProof(@PathVariable Integer id,
                                @RequestBody IdProofUpdateRequest request) {

        portalService.updateIdProof(id, request.getIdProof());

        return "ID Proof Updated Successfully";
    }

    @PostMapping("/validateId")
    public String validateId(@RequestBody Customer customer) {

        portalService.validateIdProof(customer.getId());

        return "ID Proof Valid";
    }

    // ==========================
    // SIM
    // ==========================

    @PostMapping("/addSim")
    public String addSim(@RequestBody Sim sim) {

        portalService.addSim(sim);

        return "SIM Added Successfully";
    }

    @PostMapping("/validateSim")
    public String validateSim(@RequestBody Sim sim) {

        Sim savedSim = portalService.validateSim(sim.getSimNumber());

        if (savedSim.isActive()) {
            return "SIM is Active";
        }

        return "SIM is Inactive";
    }

    @PostMapping("/activateSim")
    public String activateSim(@RequestBody Sim sim) {

        portalService.activateSim(sim.getSimNumber());

        return "SIM Activated Successfully ✅";
    }

    @PostMapping("/deactivateSim")
    public String deactivateSim(@RequestBody Sim sim) {

        portalService.deactivateSim(sim.getSimNumber());

        return "SIM Deactivated Successfully ✅";
    }

    @DeleteMapping("/deleteSim/{simNumber}")
    public String deleteSim(@PathVariable String simNumber) {

        portalService.deleteSim(simNumber);

        return "SIM Deleted Successfully";
    }

    @GetMapping("/offers/{simNumber}")
    public String getOffers(@PathVariable String simNumber) {

        return portalService.getOffer(simNumber);
    }

}