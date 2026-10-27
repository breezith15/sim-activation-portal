package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.demo.entity.Customer;
import com.example.demo.entity.Sim;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.SimRepository;

@Service
public class PortalService {

    private final CustomerRepository customerRepository;
    private final SimRepository simRepository;

    public PortalService(CustomerRepository customerRepository,
                         SimRepository simRepository) {
        this.customerRepository = customerRepository;
        this.simRepository = simRepository;
    }

    // ===========================
    // CUSTOMER
    // ===========================

    public Customer addCustomer(Customer customer) {

        if (!StringUtils.hasText(customer.getEmail())) {
            throw new IllegalArgumentException("Email is required.");
        }

        if (!StringUtils.hasText(customer.getMobileNumber())) {
            throw new IllegalArgumentException("Mobile number is required.");
        }

        customer.setEmail(customer.getEmail().trim().toLowerCase());
        customer.setMobileNumber(customer.getMobileNumber().trim());

        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Customer with this email already exists.");
        }

        if (customerRepository.findByMobileNumber(customer.getMobileNumber()).isPresent()) {
            throw new IllegalArgumentException("Customer with this mobile number already exists.");
        }

        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer validateCustomer(String email, String dob) {

        return customerRepository.findByEmailAndDob(email, dob)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invalid customer details."));
    }

    public List<Customer> validateCustomerDetails(String firstName,
                                                  String lastName,
                                                  String email) {

        List<Customer> customers =
                customerRepository.findByFirstNameAndLastNameAndEmail(
                        firstName,
                        lastName,
                        email);

        if (customers.isEmpty()) {
            throw new ResourceNotFoundException("Invalid customer details.");
        }

        return customers;
    }

    public Customer updateAddress(Integer customerId,
                                  String address) {

        if (!StringUtils.hasText(address)) {
            throw new IllegalArgumentException("Address is required.");
        }

        Customer customer = getCustomer(customerId);

        customer.setAddress(address);

        return customerRepository.save(customer);
    }

    public Customer updateIdProof(Integer customerId,
                                  String idProof) {

        if (!StringUtils.hasText(idProof)) {
            throw new IllegalArgumentException("ID Proof is required.");
        }

        Customer customer = getCustomer(customerId);

        customer.setIdProof(idProof);

        return customerRepository.save(customer);
    }

    public Customer validateIdProof(Integer customerId) {

        Customer customer = getCustomer(customerId);

        if (!StringUtils.hasText(customer.getIdProof())) {
            throw new ResourceNotFoundException("Invalid ID Proof.");
        }

        return customer;
    }

    private Customer getCustomer(Integer id) {

        return customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found."));
    }

    // ===========================
    // SIM
    // ===========================

    public Sim addSim(Sim sim) {

        if (!StringUtils.hasText(sim.getSimNumber())) {
            throw new IllegalArgumentException("SIM Number is required.");
        }

        if (!StringUtils.hasText(sim.getIccid())) {
            throw new IllegalArgumentException("ICCID is required.");
        }

        if (!StringUtils.hasText(sim.getImei())) {
            throw new IllegalArgumentException("IMEI is required.");
        }

        if (sim.getCustomerId() == null) {
            throw new IllegalArgumentException("Customer ID is required.");
        }

        customerRepository.findById(sim.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found."));

        sim.setSimNumber(sim.getSimNumber().trim());
        sim.setIccid(sim.getIccid().trim());
        sim.setImei(sim.getImei().trim());

        if (simRepository.findBySimNumber(sim.getSimNumber()).isPresent()) {
            throw new IllegalArgumentException("SIM Number already exists.");
        }

        if (simRepository.findByIccid(sim.getIccid()).isPresent()) {
            throw new IllegalArgumentException("ICCID already exists.");
        }

        if (simRepository.findByImei(sim.getImei()).isPresent()) {
            throw new IllegalArgumentException("IMEI already exists.");
        }

        sim.setActive(false);

        return simRepository.save(sim);
    }

    public Sim validateSim(String simNumber) {

        return simRepository.findBySimNumber(simNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("SIM not found."));
    }

    public Sim activateSim(String simNumber) {

        Sim sim = validateSim(simNumber);

        if (sim.isActive()) {
            throw new IllegalArgumentException("SIM is already activated.");
        }

        sim.setActive(true);

        return simRepository.save(sim);
    }

    public Sim deactivateSim(String simNumber) {

        Sim sim = validateSim(simNumber);

        if (!sim.isActive()) {
            throw new IllegalArgumentException("SIM is already inactive.");
        }

        sim.setActive(false);

        return simRepository.save(sim);
    }
    public void deleteSim(String simNumber) {

        Sim sim = validateSim(simNumber);

        simRepository.delete(sim);
    }

    public String getOffer(String simNumber) {

        Sim sim = validateSim(simNumber);

        if (!sim.isActive()) {
            throw new IllegalArgumentException(
                    "Activate the SIM before viewing offers.");
        }

        String plan = sim.getPlanName();

        if (plan == null) {
            return "Welcome Offer: 1GB/day for 15 Days";
        }

        switch (plan) {

            case "Daily Data 399":
                return "Special Offer: Free 2GB/day for 30 Days";

            case "Unlimited 599":
                return "Special Offer: Free OTT Subscription for 90 Days";

            case "Premium 799":
                return "Special Offer: Unlimited 5G + OTT + 500 SMS/day";

            default:
                return "Special Offer: 1GB/day for 15 Days";
        }
    }

    // ===========================
    // DASHBOARD
    // ===========================

    public long getCustomerCount() {
        return customerRepository.count();
    }

    public long getSimCount() {
        return simRepository.count();
    }

    public long getActivatedSimCount() {
        return simRepository.countByActive(true);
    }

    public long getInactiveSimCount() {
        return simRepository.countByActive(false);
    }

}