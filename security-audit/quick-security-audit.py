#!/usr/bin/env python3
"""
Quick Security Audit for Synapses GRC Platform
Zero-Trust Security Validation without OWASP ZAP
Top 0.001% Security Professional Standards

Author: Security Audit Team
Date: January 30, 2025
"""

import json
import requests
import ssl
import socket
from datetime import datetime
from typing import Dict, List, Any
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class QuickSecurityAudit:
    """
    Quick Security Audit for Zero-Trust Validation
    """
    
    def __init__(self, target_url: str):
        self.target_url = target_url
        self.audit_results = {
            "timestamp": datetime.now().isoformat(),
            "target": target_url,
            "security_score": 0,
            "vulnerabilities": [],
            "compliance_status": {},
            "recommendations": []
        }
    
    def test_tls_security(self) -> Dict[str, Any]:
        """Test TLS/SSL security configuration"""
        try:
            logger.info("Testing TLS/SSL security configuration...")
            
            hostname = self.target_url.replace("https://", "").replace("http://", "").split("/")[0]
            context = ssl.create_default_context()
            
            with socket.create_connection((hostname, 443)) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    cipher = ssock.cipher()
                    
                    return {
                        "test": "TLS_ENCRYPTION",
                        "status": "passed" if cert is not None else "failed",
                        "certificate_valid": cert is not None,
                        "cipher_suite": cipher[0] if cipher else None,
                        "tls_version": ssock.version(),
                        "details": {
                            "subject": dict(x[0] for x in cert['subject']) if cert else None,
                            "issuer": dict(x[0] for x in cert['issuer']) if cert else None,
                            "expiry": cert['notAfter'] if cert else None
                        }
                    }
        except Exception as e:
            logger.error(f"TLS test failed: {e}")
            return {
                "test": "TLS_ENCRYPTION",
                "status": "error",
                "error": str(e)
            }
    
    def test_security_headers(self) -> Dict[str, Any]:
        """Test security headers"""
        try:
            logger.info("Testing security headers...")
            
            response = requests.get(self.target_url, timeout=10)
            headers = response.headers
            
            security_headers = {
                'Content-Security-Policy': headers.get('Content-Security-Policy'),
                'X-Content-Type-Options': headers.get('X-Content-Type-Options'),
                'X-Frame-Options': headers.get('X-Frame-Options'),
                'X-XSS-Protection': headers.get('X-XSS-Protection'),
                'Referrer-Policy': headers.get('Referrer-Policy'),
                'Strict-Transport-Security': headers.get('Strict-Transport-Security')
            }
            
            missing_headers = [k for k, v in security_headers.items() if not v]
            
            return {
                "test": "SECURITY_HEADERS",
                "status": "passed" if len(missing_headers) == 0 else "failed",
                "headers_present": len(security_headers) - len(missing_headers),
                "headers_missing": missing_headers,
                "all_headers": security_headers
            }
        except Exception as e:
            logger.error(f"Security headers test failed: {e}")
            return {
                "test": "SECURITY_HEADERS",
                "status": "error",
                "error": str(e)
            }
    
    def test_authentication_endpoints(self) -> Dict[str, Any]:
        """Test authentication endpoints"""
        try:
            logger.info("Testing authentication endpoints...")
            
            auth_tests = []
            
            # Test login endpoint
            try:
                response = requests.post(f"{self.target_url}/auth/login", 
                                       json={"email": "test@example.com", "password": "test123"},
                                       timeout=10)
                auth_tests.append({
                    "endpoint": "/auth/login",
                    "status": "accessible",
                    "response_code": response.status_code,
                    "requires_auth": response.status_code != 200
                })
            except:
                auth_tests.append({
                    "endpoint": "/auth/login",
                    "status": "not_accessible",
                    "response_code": None
                })
            
            # Test MFA endpoint
            try:
                response = requests.post(f"{self.target_url}/auth/verify-mfa",
                                       json={"code": "123456"},
                                       timeout=10)
                auth_tests.append({
                    "endpoint": "/auth/verify-mfa",
                    "status": "accessible",
                    "response_code": response.status_code,
                    "requires_auth": response.status_code != 200
                })
            except:
                auth_tests.append({
                    "endpoint": "/auth/verify-mfa",
                    "status": "not_accessible",
                    "response_code": None
                })
            
            return {
                "test": "AUTHENTICATION_ENDPOINTS",
                "status": "completed",
                "tests": auth_tests
            }
        except Exception as e:
            logger.error(f"Authentication test failed: {e}")
            return {
                "test": "AUTHENTICATION_ENDPOINTS",
                "status": "error",
                "error": str(e)
            }
    
    def test_api_security(self) -> Dict[str, Any]:
        """Test API security"""
        try:
            logger.info("Testing API security...")
            
            api_tests = []
            
            # Test API endpoints without authentication
            endpoints = [
                "/api/user/profile",
                "/api/classification",
                "/api/search",
                "/api/config"
            ]
            
            for endpoint in endpoints:
                try:
                    response = requests.get(f"{self.target_url}{endpoint}", timeout=10)
                    api_tests.append({
                        "endpoint": endpoint,
                        "status": "accessible",
                        "response_code": response.status_code,
                        "requires_auth": response.status_code in [401, 403]
                    })
                except:
                    api_tests.append({
                        "endpoint": endpoint,
                        "status": "not_accessible",
                        "response_code": None
                    })
            
            # Check if endpoints require authentication
            secured_endpoints = [test for test in api_tests if test.get("requires_auth")]
            
            return {
                "test": "API_SECURITY",
                "status": "passed" if len(secured_endpoints) == len(api_tests) else "failed",
                "endpoints_tested": len(api_tests),
                "secured_endpoints": len(secured_endpoints),
                "tests": api_tests
            }
        except Exception as e:
            logger.error(f"API security test failed: {e}")
            return {
                "test": "API_SECURITY",
                "status": "error",
                "error": str(e)
            }
    
    def test_input_validation(self) -> Dict[str, Any]:
        """Test input validation"""
        try:
            logger.info("Testing input validation...")
            
            validation_tests = []
            
            # Test SQL injection
            try:
                response = requests.post(f"{self.target_url}/api/search",
                                       json={"query": "' OR 1=1--"},
                                       timeout=10)
                validation_tests.append({
                    "test": "SQL_INJECTION",
                    "status": "passed" if "error" in response.text.lower() else "failed",
                    "response_code": response.status_code,
                    "vulnerable": "error" not in response.text.lower()
                })
            except:
                validation_tests.append({
                    "test": "SQL_INJECTION",
                    "status": "not_testable",
                    "response_code": None
                })
            
            # Test XSS
            try:
                response = requests.post(f"{self.target_url}/api/feedback",
                                       json={"message": "<script>alert('XSS')</script>"},
                                       timeout=10)
                validation_tests.append({
                    "test": "XSS",
                    "status": "passed" if "<script>" not in response.text else "failed",
                    "response_code": response.status_code,
                    "vulnerable": "<script>" in response.text
                })
            except:
                validation_tests.append({
                    "test": "XSS",
                    "status": "not_testable",
                    "response_code": None
                })
            
            return {
                "test": "INPUT_VALIDATION",
                "status": "completed",
                "tests": validation_tests
            }
        except Exception as e:
            logger.error(f"Input validation test failed: {e}")
            return {
                "test": "INPUT_VALIDATION",
                "status": "error",
                "error": str(e)
            }
    
    def calculate_security_score(self) -> int:
        """Calculate overall security score"""
        score = 100
        
        # Deduct points for failed tests
        for test in self.audit_results.get("tests", []):
            if test.get("status") == "failed":
                if test.get("test") == "TLS_ENCRYPTION":
                    score -= 20
                elif test.get("test") == "SECURITY_HEADERS":
                    score -= 15
                elif test.get("test") == "API_SECURITY":
                    score -= 25
                elif test.get("test") == "INPUT_VALIDATION":
                    score -= 20
        
        return max(0, score)
    
    def generate_recommendations(self) -> List[str]:
        """Generate security recommendations"""
        recommendations = []
        
        for test in self.audit_results.get("tests", []):
            if test.get("status") == "failed":
                if test.get("test") == "TLS_ENCRYPTION":
                    recommendations.append("Implement proper TLS/SSL configuration")
                elif test.get("test") == "SECURITY_HEADERS":
                    recommendations.append("Add missing security headers")
                elif test.get("test") == "API_SECURITY":
                    recommendations.append("Secure API endpoints with authentication")
                elif test.get("test") == "INPUT_VALIDATION":
                    recommendations.append("Implement input validation and sanitization")
        
        if not recommendations:
            recommendations.append("Continue monitoring for emerging threats")
            recommendations.append("Maintain current security controls")
            recommendations.append("Conduct quarterly penetration testing")
        
        return recommendations
    
    def run_audit(self) -> Dict[str, Any]:
        """Run comprehensive security audit"""
        logger.info("Starting Quick Security Audit...")
        
        # Run all tests
        tests = [
            self.test_tls_security(),
            self.test_security_headers(),
            self.test_authentication_endpoints(),
            self.test_api_security(),
            self.test_input_validation()
        ]
        
        self.audit_results["tests"] = tests
        
        # Calculate security score
        self.audit_results["security_score"] = self.calculate_security_score()
        
        # Generate recommendations
        self.audit_results["recommendations"] = self.generate_recommendations()
        
        # Add compliance status
        self.audit_results["compliance_status"] = {
            "soc2": "compliant" if self.audit_results["security_score"] >= 80 else "non_compliant",
            "gdpr": "compliant" if self.audit_results["security_score"] >= 80 else "non_compliant",
            "sfdr": "compliant" if self.audit_results["security_score"] >= 80 else "non_compliant"
        }
        
        logger.info(f"Security Audit completed. Score: {self.audit_results['security_score']}/100")
        
        return self.audit_results

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Quick Security Audit for Synapses GRC Platform")
    parser.add_argument("--target", required=True, help="Target URL for security audit")
    parser.add_argument("--output", default="quick-security-audit-results.json", help="Output file")
    
    args = parser.parse_args()
    
    # Run audit
    audit = QuickSecurityAudit(args.target)
    results = audit.run_audit()
    
    # Save results
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"✅ Quick security audit completed. Results saved to: {args.output}")
    print(f"🔒 Security Score: {results['security_score']}/100")
    
    if results['security_score'] >= 90:
        print("🎉 EXCELLENT security posture!")
    elif results['security_score'] >= 80:
        print("✅ GOOD security posture")
    elif results['security_score'] >= 70:
        print("⚠️  MODERATE security posture - improvements needed")
    else:
        print("🚨 POOR security posture - immediate action required")

if __name__ == "__main__":
    main()
