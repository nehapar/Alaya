module ProvidersHelper
  # for an entry ID_HH_MM
  # it return the ID of half hour before
  # 
  # For 1_13_30, it returns 1_13_00
  # For 1_13_00, it returns 1_12_30
  # 
  # @params: [id] the id of a cell to get the id of the cell before
  # 
  # @author: Thiago Melo
  # @version: 2015-03-21
  def prevTimeCellID(id)
    parts = id.split("_");
    hour = parts[1].to_i
    minutes = parts[2].to_i
    hour = minutes == 0 ? hour - 1 : hour
    hour = hour >= 10 ? hour.to_s : "0" + hour.to_s
    minutes = minutes == 0 ? 30 : 0
    minutes = minutes >= 10 ? minutes.to_s : "0" + minutes.to_s
    return parts[0] + "_" + hour + "_" + minutes
  end
  
  # for an entry ID_HH_MM
  # it return the ID of half hour after
  # 
  # For 1_13_30, it returns 1_14_00
  # For 1_13_00, it returns 1_13_30
  # 
  # @params: [id] the id of a cell to get the id of the cell after
  # 
  # @author: Thiago Melo
  # @version: 2015-03-21
  def nextTimeCellID(id)
    parts = id.split("_");
    hour = parts[1].to_i
    minutes = parts[2].to_i
    hour = minutes == 0 ? hour : hour + 1
    hour = hour >= 10 ? hour.to_s : "0" + hour.to_s
    minutes = minutes == 0 ? 30 : 0
    minutes = minutes >= 10 ? minutes.to_s : "0" + minutes.to_s
    return parts[0] + "_" + hour + "_" + minutes
  end
end
