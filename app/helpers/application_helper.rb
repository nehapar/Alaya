module ApplicationHelper
  def appointment_states
    return { 0 => "Pending", 1 => "Confirmed", 2 => "Denied" }
  end
end
