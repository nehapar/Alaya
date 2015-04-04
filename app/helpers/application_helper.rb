module ApplicationHelper
  def appointment_states
    return { 0 => "Pending", 1 => "Confirmed", 2 => "Denied" }
  end
  
  def appointment_types
    return { 0 => "Pregnancy Massage", 1 => "Lactation Consultation", 2 => "Birth Doula Consultation", 3 => "PostPartum Doula Consultation", 4 => "Follow-up Visit" }
  end
end
